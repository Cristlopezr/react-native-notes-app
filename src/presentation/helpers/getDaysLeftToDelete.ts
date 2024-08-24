export const getDaysLeftToDelete = (createdDate: string) => {
  //Created date + 30 days in milliseconds
  const targetDateInMs = Number(createdDate) + 30 * 24 * 60 * 60 * 1000;

  //Current date in milliseconds
  const currentDateInMs = new Date().getTime();

  //Difference in milliseconds
  const differenceInMs = targetDateInMs - currentDateInMs;

  //Convert difference in milliseconds in days
  return Math.ceil(differenceInMs / (24 * 60 * 60 * 1000));
};
