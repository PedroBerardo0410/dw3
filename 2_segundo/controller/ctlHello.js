const hello = (req, res) => {
  res.json({
    status: "ok",
    mensagem: "Olá segundo!",
  });
};

const helloUserGet = (req, res) => {
  const { username } = req.params;

  res.json({
    status: "ok",
    nomeusuario: username,
  });
};

const helloUserPost = (req, res) => {
  const { username } = req.body;

  res.json({
    status: "ok",
    nomeusuario: username,
  });
};

module.exports = {
  hello,
  helloUserGet,
  helloUserPost,
};