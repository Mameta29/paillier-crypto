pragma circom 2.0.0;

template Main() {
    signal input encNum;
    signal input lambda;
    signal input mu;
    signal input n;
    signal output plainNum;

    // 平均スコアの計算
    plainNum <-- decrypt(encNum, n, lambda, mu);
}

function decrypt(encNum, n, lambda, mu) {
    var nn = n * n;
    log("ekNN is", ekNN);
    var numL = (modPow(encNum, lambda, nn) - 1) \ n;
    log("numL is", numL);
    log("mu is", mu);
    var plain = numL * mu % n;
    log("n is", n);
    return plain;
}

function modPow(x, e, m) {
    var result = 1;
    while (e > 0) {
        if (e % 2 == 1) {
            result = (result * x) % m;
        }
        x = (x * x) % m;
        e = e >> 1;
    }
    return result;
}

component main {public [totalScore, totalEvaluater, encryptionKeyN]} = Main();