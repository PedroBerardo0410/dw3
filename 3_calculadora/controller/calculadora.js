const somar = (req, res) => {
    const { num1, num2 } = req.body;

    const resultado = Number(num1) + Number(num2);

    res.json({
        operacao: "soma",
        resultado: resultado
    });
};


const subtrair = (req, res) => {
    const { num1, num2 } = req.body;

    const resultado = Number(num1) - Number(num2);

    res.json({
        operacao: "subtracao",
        resultado: resultado
    });
};


const multiplicar = (req, res) => {
    const { num1, num2 } = req.body;

    const resultado = Number(num1) * Number(num2);

    res.json({
        operacao: "multiplicacao",
        resultado: resultado
    });
};


const dividir = (req, res) => {
    const { num1, num2 } = req.body;

    if (Number(num2) === 0) {
        return res.status(400).json({
            status: "erro",
            mensagem: "Não é possível dividir por zero"
        });
    }

    const resultado = Number(num1) / Number(num2);

    res.json({
        operacao: "divisao",
        resultado: resultado
    });
};


module.exports = {
    somar,
    subtrair,
    multiplicar,
    dividir
};