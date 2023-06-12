const isEmpty = (props: string[]) => {
  return props.some((prop) => !prop || !prop.trim().length);
};

export { isEmpty };
