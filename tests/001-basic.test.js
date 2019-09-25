require('./_gen-shell-exec-mock');

test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

describe('Validity of return value of function', () => {
    test('JSON serializable', async (done) => {
        const argument = [{name: 'myService.service'}];
        const res = await (require('../src/')(argument));

        expect(JSON.stringify(res)).toBeTruthy();
        done();
    });
});