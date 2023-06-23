const isEmpty = (props: string[]) => {
  return props.some((prop) => !prop || !prop.trim().length);
};

const todayFormattedDate = () => {
  const currentDate = new Date();
  // returns ex. => 06062023
  return (
    ('0' + (currentDate.getMonth() + 1)).slice(-2) +
    ('0' + currentDate.getDate()).slice(-2) +
    currentDate.getFullYear()
  );
};

export { isEmpty, todayFormattedDate };
