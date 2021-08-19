'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};
//NOTE: in there bug for ss-4444(sarah simith) because she is not out money
const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

// in & out & interest (Summary)
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(cur => cur > 0)
    .reduce((acc, cur) => acc + cur);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(cur => cur < 0)
    .reduce((acc, cur) => acc + cur);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(cur => cur > 0)
    .map(cur => (cur * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.textContent = `${interest}€`;
};

//username
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(x => x[0])
      .join('');
  });
};
createUserName(accounts);

// Refactor - Global func or variable

const updateUi = function (acc) {
  //display movements
  displayMovements(acc.movements);

  //display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

let currentAccount;

// Event Handler - Login Account

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //if button in a form this need(without this,reload page)
  currentAccount = accounts.find(
    cur => cur.userName === inputLoginUsername.value
  );
  //correct pin and user
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display User Interface and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    console.log(currentAccount);
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //update UI
    updateUi(currentAccount);
  }
});

// Transfer Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    cur => cur.userName === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // doing to transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update UI
    updateUi(currentAccount);
  }
  //clear input fields (self adding)
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

//Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(cur => cur >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);
    //update UI
    updateUi(currentAccount);
    //clear loan input field
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      cur => cur.userName === currentAccount.userName
    );

    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
});

//Sort movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; /*

/////////////////////////////////////////////////
/*
const arr = ["a", "b", "c", "d", "e"];

//SLİCE METHOD
console.log(arr.slice(2, 3))
console.log(typeof arr.slice) // methods are simply functions.
console.log([...arr])
//SPLICE METHOD (same slice but changing original array)
// console.log(arr.splice(3))
// console.log(arr.splice(3, 1))
// console.log(arr.splice(0, 0, "k"))
console.log(arr);
//REVERSE METHOD
const arr2 = ["f", "g", "h", "i", "j"]
console.log(arr2.reverse())
//CONCAT METHOD
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);
//JOIN METHOD
console.log(letters.join(" - "))
*/ /*

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`)
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`)
  }
};

console.log("---- FOREACH ----")

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`)
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`)
  }
});

movements.forEach(function (curr, i, arr) {
  console.log(`${i + 1}:  ${curr}`)
});
*/ /*
/* //set
const myArr = [2, 4, 3, 2, 5, 5, 6];

console.log(myArr)
const myArrSet = new Set(myArr);
console.log(myArrSet)
//map
const myMap = new Map([
  ["name", "mali"],
  ["surname", "bilgin"],
  ["age", 30]
])
//console.log(myMap.get("name"))
myMap.forEach(function (value, key, map) {
  console.log(value)
  console.log(key)
  console.log(map)
})
*/ /*
/* //map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`)
})

//set

const uniqueCurrencies = new Set(["USD", "GBP", "USD", "EUR", "EUR"]);

console.log(uniqueCurrencies)
uniqueCurrencies.forEach(function (val, val_, set) {
  console.log(val)
  console.log(val_)
  console.log(set)
})
*/ /*
/*
// challenge 1

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaNew = dogsJulia.slice(1, 3);

  const allDogs = dogsJuliaNew.concat(dogsKate);
  console.log(allDogs)

  allDogs.forEach(function (curr, i) {
    if (curr >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${curr} years old.`)
    } else {
      console.log(`Dog number ${i + 1} is still a puppy.`)
    }
  });


};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/ /*
/*
const myArr = [1, 5, 9];
console.log(myArr.map(x => x * 2));
console.log(
  myArr.map((currentValue, index, array) => {
    currentValue * 3;
  })
);

myArr.map((currentValue, index, array) => {
  console.log(currentValue * 3);
});

const map1 = myArr.map(function callbackFn(currentValue, index, array) {
  return array[index] * 3;
});
console.log(map1);

console.log(
  myArr.map(function callbackFn(currentValue, index, array) {
    return currentValue * 3;
  })
);

console.log(myArr.filter(x => x > 5));
console.log(myArr.reduce((acc, cur) => acc + cur));

myArr.map(function cllbk(curr, i, arr) {
  console.log(curr);
}, 4);
*/ /*
/*

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurosToDollar = 1.1;

const movementsDollars = movements.map(x => x * eurosToDollar);
console.log(movementsDollars)

const movementsDestription = movements.map((mov, i) =>
  `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(mov)}`
);
console.log(movementsDestription)
*/ /*
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(deposits);

const withdrawals = movements.filter(curr => curr < 0);
console.log(withdrawals);
*/ /*
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements)


// const balance = movements.reduce(function (acc, curr, i) {
//   console.log(`iteration ${i}:acucumulator ${acc}`)
//   return acc + curr;
// }, 0);
// console.log(balance)

const balance2 = movements.reduce((acc, curr) => acc + curr);
console.log(balance2)

//maximum value
const max = movements.reduce(function (acc, cur) {
  if (acc > cur)
    return acc;
  else
    return cur;
}, movements[0])
console.log(max)
*/ /*
/*
// challenge 2
//my solution

const calcAverageHumanAge1 = function (ages) {
  const humanAge = ages.map(cur => cur <= 2 ? cur * 2 : (cur * 4) + 16);
  const adultAges = humanAge.filter(x => x >= 18);
  console.log(adultAges)
  const sumAdultAges = adultAges.reduce((acc, cur) => acc + cur)
  const averageAge = sumAdultAges / adultAges.length;
  return averageAge;
};

//my solution arrow func. and useşng chaining version
const calcAverageHumanAge = ages => ages.map(cur => cur <= 2 ? cur * 2 : (cur * 4) + 16).filter(x => x >= 18).reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

*/ /*
/*

//jonas solution

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => age <= 2 ? age * 2 : 16 + age * 4);
  const adults = humanAges.filter(age => age >= 18)
  const average = adults.reduce((acc, cur) => acc + cur, 0) / adults.length;
  return average
};
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2) //...
*/ /*
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurosToDollar = 1.1;
const totalDepositsDolar = movements.filter(cur => cur > 0).map(cur => cur * eurosToDollar).reduce((acc, cur) => acc + cur, 0);
console.log(totalDepositsDolar)
*/ /*
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(cur => cur < 0);
console.log(firstWithdrawal);

const account = accounts.find(cur => cur.owner === "Jessica Davis");
console.log(account)
console.log("------")

let accountForVersion;
for (const acco of accounts) {
  if (acco.owner === "Jessica Davis") {
    accountForVersion = acco;
  };
};
console.log(accountForVersion);
*/
/*
console.log(movements);
console.log(movements.includes(-130));

const anyDeposits = movements.some(cur => cur > 0);
console.log(anyDeposits)
console.log(account1.movements.every(cur => cur > 0));
console.log(account4.movements.every(cur => cur > 0));
*/
/*
const nestedArr = [[1, 2, 3], [4, 5, 6], 7, 8, 9];
console.log(nestedArr.length);
console.log(nestedArr.flat().length);

const nestedArrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8, 9];
console.log(nestedArrDeep.length);
console.log(nestedArrDeep.flat(2));

const accountMovements = accounts.map(cur => cur.movements);
console.log(accountMovements)

const allMovements = accountMovements.flat();
console.log(allMovements);

const overallBalance = allMovements.reduce((acc, cur) => acc + cur);
console.log(overallBalance)

const overallBalance2 = accounts.map(cur => cur.movements).flat().reduce((acc, cur) => acc + cur);
console.log(overallBalance2);
// with flatMap()
const overallBalance3 = accounts.flatMap(cur => cur.movements).reduce((acc, cur) => acc + cur);
console.log(overallBalance3);
*/
/*
function findNeedle(haystack) {
  const find = haystack.findIndex(cur => cur === "needle")
  return `found the needle at position ${find}`
};

console.log(findNeedle(['hay', 'junk', 'hay', 'hay', 'moreJunk', 'needle', 'randomJunk']))

const arr = [-2, 4, 3, 0, 2, -1, 1];
console.log(arr.sort((a, b) => a - b))
console.log(arr.sort((a, b) => b - a))
console.log(arr)

const arr2 = [, 4, 2, 5, 3, 1];
console.log(arr2.sort((a, b) => a - b))
console.log(arr2.sort((a, b) => b - a))
console.log(arr2)

console.log(movements)
console.log(movements.sort((a, b) => a - b))


const mov = [8, 9, 1, 2, 3, 4];
console.log(mov.sort((a, b) => {
  //   console.log(a, b)

  // if (a > b) console.log(a, b)
  // if (b > a) console.log(b, a)

  console.log(`comparing ${a},${b}`);
  return a > b ? 1 : a === b ? 0 : -1;
}));
*/
/*
//fill method
const arr = new Array(7);
console.log(arr);
console.log(arr.map(x => x * 2));
arr.fill(1);
console.log(arr);
// arr.fill(1, 3);
console.log(arr);
// arr.fill(1, 3, 5);
console.log(arr);
arr.fill(4, 3);
console.log(arr);

//from method

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

console.log(Array.from('mali', x => x + 1));
console.log(Array.from('mali', x => x + x));
console.log(Array.from({ length: 7 }, (_, i) => i + 1));

const movementsUI = Array.from(document.querySelectorAll('.movements__value'));

console.log(movementsUI);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    a => Number(a.textContent.replace('€', ''))
  );

  console.log(movementsUI);

  //second way
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});
*/
/*
//practice array methods
//1.
const bankDepositSum = accounts
  .flatMap(cur => cur.movements)
  .filter(cur => cur > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositSum);
//2.

const numDeposit1000 = accounts
  .flatMap(cur => cur.movements)
  .filter(cur => cur > 1000).length;
console.log(numDeposit1000);
//same but using reduce method
const numDeposit1000Rdc = accounts
  .flatMap(cur => cur.movements)
  .reduce((acc, cur) => (cur >= 1000 ? acc + 1 : acc), 0);
console.log(numDeposit1000Rdc);

console.log(movements);
console.log(movements.reduce((acc, cur) => (cur < 0 ? acc + 1 : acc), 0));
const maxx = function (max, cu) {
  return Math.max(max, cu.x);
};
const arr = [{ x: 62 }, { x: 45 }, { x: 98 }];
console.log(arr.reduce(maxx, 0));

//3.
const { deposits, witdrawals } = accounts
  .flatMap(cur => cur.movements)
  .reduce(
    (acc, cur) => {
      // cur > 0 ? (acc.deposits += cur) : (acc.witdrawals += cur);
      acc[cur > 0 ? 'deposits' : 'witdrawals'] += cur;
      return acc;
    },
    { deposits: 0, witdrawals: 0 }
  );

console.log(deposits, witdrawals);

//4. this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(cur =>
      exceptions.includes(cur) ? cur : cur[0].toUpperCase() + cur.slice(1)
    )
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but it no too long'));
console.log(convertTitleCase('and another example title with HERE'));

//codewar
// function isPangram(string) {
//   const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
//   console.log(alphabet.map(cur => (cur.includes(string) ? true : false)));
//   return string.includes(alphabet) ? true : false;
// }

// console.log(isPangram('The quick brown fox jumps over the lazy dog.'));

//codewar
// function solution(str) {
//   // const a = [];
//   // const b = str.split('');
//   // a.push(b.map((cur, i) => cur + b[i + 1]));
//   // return a.flat();

//   const a = [];
//   const x = [];
//   const b = str.split('');
//   for (let i = 0; i < b.length; i++) {
//     console.log(b[i]);
//     a.push(b[i] + b[i + 1]);
//     console.log(a);
//   }
//   for (let i = 0; i < a.length; i++) {
//     if (!(i % 2)) {
//       console.log(a[i]);
//       // x.push(a[i]);
//     }
//     return x;
//   }
// }

// // console.log(solution('abc'));
// console.log(solution('abcdef'));
*/
//CHALLENGE 4#
/*
     Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
     Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
     Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

     Your tasks:

     1. Loopoverthe'dogs'arraycontainingdogobjects,andforeachdog,calculate the recommended food portion and add it to the object as a new property. Do not create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
     2. FindSarah'sdogandlogtotheconsolewhetherit'seatingtoomuchortoo little. Hint: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
     3. Createanarraycontainingallownersofdogswhoeattoomuch ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
     4. Logastringtotheconsoleforeacharraycreatedin3.,likethis:"Matildaand Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
     5. Logtotheconsolewhetherthereisanydogeatingexactlytheamountoffood that is recommended (just true or false)
     6. Logtotheconsolewhetherthereisanydogeatinganokayamountoffood (just true or false)
     7. Createanarraycontainingthedogsthatareeatinganokayamountoffood(try to reuse the condition used in 6.)
     8. Createashallowcopyofthe'dogs'arrayandsortitbyrecommendedfood portion in an ascending order (keep in mind that the portions are inside the array's objects 😉)

     */

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// console.log(dogs[0]);

//1.
const recommendedFood = function (dogs) {
  dogs.forEach(function (cur) {
    cur.recommendedFood = Math.trunc(cur.weight ** 0.75 * 28);
  });
};
recommendedFood(dogs);
// console.log(dogs);
//2.

//3.
/*
let ownersEatTooMuch = [];
let ownersEatTooLittle = [];
const ownersEat = function (cur) {
  // console.log(cur);
  cur.map(cu =>
    cu.curFood > cu.recommendedFood
      ? ownersEatTooMuch.push(cu)
      : ownersEatTooLittle.push(cu)
  );
};
ownersEat(dogs);
*/
// console.log(ownersEatTooMuch, ownersEatTooLittle);

//4.

//5.

//6.
// current > (recommended * 0.90) && current < (recommended * 1.10)

// dogs.find(cur =>
//   cur.curFood > cur.recommendedFood * 0.9 &&
//   cur.curFood < cur.recommendedFood * 1.1
//     ? console.log(true)
//     : console.log(false)
// );

//Jonas Solution
// 1.same with mine
//2.
const dogSarah = dogs.find(ite => ite.owners.includes('Sarah'));

console.log(dogSarah);
const dogSarahMuch =
  dogSarah.curFood > dogSarah.recommendedFood
    ? console.log('to-much')
    : console.log('to-little');
console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'to-much' : 'to-little'
  }`
);
//3.
const ownersEatTooMuch = dogs
  .filter(cur => cur.curFood > cur.recommendedFood)
  .flatMap(cur => cur.owners);
const ownersEatTooLittle = dogs
  .filter(cur => cur.curFood < cur.recommendedFood)
  .flatMap(cur => cur.owners);

console.log(ownersEatTooMuch, ownersEatTooLittle);
//4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much.`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little.`);
//5.
console.log(dogs.some(cur => cur.curFood == cur.recommendedFood));
//6
const checkEatingOkay = cur =>
  cur.curFood > cur.recommendedFood * 0.9 &&
  cur.curFood < cur.recommendedFood * 1.1;

console.log(dogs.some(checkEatingOkay));

//7.
console.log(dogs.filter(checkEatingOkay));
//8
console.log(dogs);
const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsCopy);
