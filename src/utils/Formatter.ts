const Formatter = {
  document1: function (text: string) {
    return text
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  },
};

export default Formatter;
