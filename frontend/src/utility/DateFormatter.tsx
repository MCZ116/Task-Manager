const formatDateAsDMY = (date: Date): Date => {
  const formattedDate = date.toString();
  const [day, month, year] = formattedDate.split("/");

  return new Date(`${year}-${month}-${day}`);
};

const formatDateToDMYString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
};

export { formatDateAsDMY, formatDateToDMYString };
