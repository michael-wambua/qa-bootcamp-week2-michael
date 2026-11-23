type Customer = {
  birthday?: Date;
};

function getCustomer(id: number): Customer | null | undefined {
  return id === 0 ? null : { birthday: new Date() };
}

// Optional property access operator
console.log(getCustomer(0)?.birthday?.getFullYear());
console.log(getCustomer(1)?.birthday?.getFullYear());