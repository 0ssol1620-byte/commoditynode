import subprocess
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run_node(source: str):
    return subprocess.run(
        ['node', '-e', source],
        cwd=ROOT,
        text=True,
        capture_output=True,
        timeout=10,
    )


def test_verify_request_rejects_unsigned_jwt_without_clerk_session_claim():
    script = r"""
    process.env.CLERK_SECRET_KEY = 'test_secret';
    const auth = require('./api/_auth');
    function b64(obj){ return Buffer.from(JSON.stringify(obj)).toString('base64url'); }
    const forged = b64({alg:'none',typ:'JWT'}) + '.' + b64({sub:'user_fake'}) + '.bogus';
    auth.verifyRequest({headers:{authorization:'Bearer ' + forged}})
      .then(() => { console.error('accepted forged token'); process.exit(1); })
      .catch((err) => {
        if (!String(err.message || '').includes('Missing Clerk session claim')) {
          console.error('wrong error:', err.message);
          process.exit(1);
        }
        process.exit(0);
      });
    """
    result = run_node(textwrap.dedent(script))
    assert result.returncode == 0, result.stderr + result.stdout


def test_verify_request_requires_clerk_session_verify_success_and_user_match():
    script = r"""
    process.env.CLERK_SECRET_KEY = 'test_secret';
    const https = require('https');
    https.request = function(options, callback){
      const {EventEmitter} = require('events');
      const req = new EventEmitter();
      req.write = function(){};
      req.end = function(){
        const res = new EventEmitter();
        res.statusCode = 200;
        callback(res);
        res.emit('data', JSON.stringify({id:'sess_123', user_id:'user_real'}));
        res.emit('end');
      };
      return req;
    };
    const auth = require('./api/_auth');
    function b64(obj){ return Buffer.from(JSON.stringify(obj)).toString('base64url'); }
    const token = b64({alg:'none',typ:'JWT'}) + '.' + b64({sub:'user_fake', sid:'sess_123'}) + '.bogus';
    auth.verifyRequest({headers:{authorization:'Bearer ' + token}})
      .then(() => { console.error('accepted mismatched Clerk session'); process.exit(1); })
      .catch((err) => {
        if (!String(err.message || '').includes('Session user mismatch')) {
          console.error('wrong error:', err.message);
          process.exit(1);
        }
        process.exit(0);
      });
    """
    result = run_node(textwrap.dedent(script))
    assert result.returncode == 0, result.stderr + result.stdout
