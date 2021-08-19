let accounts = [];
let logginedUser;
let totalBalance = 0;
let account1 = {
  owner: "user1",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  transactionsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2021-08-18T10:51:36.790Z",
  ],
  currency: "EUR",
};
let account2 = {
  owner: "user2",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  transactionsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
};
accounts = [account1, account2];

let signupForm = document.querySelector(".signup-page");
let transactionsEl = document.querySelector(".transactions");
let transactionRows = document.querySelector(".transaction-rows");
let summaryIn = document.querySelector(".svalue-in");
let summaryOut = document.querySelector(".svalue-out");
let summaryInterest = document.querySelector(".svalue-interest");
let btnSignIn = document.querySelector(".signin");
let userName = document.querySelector(".username");
let loginPin = document.querySelector(".pin");
let mainEle = document.querySelector(".main");
let btnTransfer = document.querySelector(".btn-transfer");
let btnLoan = document.querySelector(".btn-loan");
let btnClose = document.querySelector(".btn-close");
let btnSort = document.querySelector(".btn-sort");
let date = document.querySelector(".date");

/*signing up*/
document.querySelector(".btn-signup").addEventListener("click", function () {
  signupForm.style.display = "block";
  mainEle.style.visibility = "hidden";
});

document.querySelector(".signup").addEventListener("click", function (e) {
  e.preventDefault();
  let account = {};
  signupForm.style.display = "none";
  account.owner = document.querySelector(".suser").value;
  account.pin = Number(document.querySelector(".spassword").value);
  if (account.owner === "" || account.pin === 0)
    alert("please fill out the fileds");
  account.transactions = [];
  account.transactionsDates = [];
  account.interestRate = 1.2;
  accounts.push(account);
});
let sInter;

logOutTimer = function () {
  let min = 4;
  let sec = 59;
  sInter = setInterval(function () {
    if (sec === 0) {
      min -= 1;

      sec = 59;
    }
    sec -= 1;
    if (min === -1) {
      location.reload();
    }
    document.querySelector(".timer").textContent = `${String(min).padStart(
      2,
      0
    )}:${String(sec).padStart(2, 0)}`;
  }, 1000);
};

//display date
let currentDate = new Date();
let gdate = currentDate.getDate();
let year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1;
let hours = currentDate.getHours();
let minutes = String(currentDate.getMinutes()).padStart(2, 0);
date.textContent = `${gdate}/${month}/${year},${hours}:${minutes}`;

//sorting transactions
let sort = false;
let newArr = [];
btnSort.addEventListener("click", function () {
  sort = !sort;
  newArr = logginedUser.transactions.slice();
  newArr.sort(function (a, b) {
    return a - b;
  });
  displayTransactions(logginedUser);
});

//display the transactions
displayTransactions = function (user) {
  let arr;
  //sorting logic
  if (sort) {
    arr = newArr;
    sort = true;
  } else arr = user.transactions;

  //clearing the hardcoded transactions
  transactionRows.innerHTML = "";
  arr.forEach(function (ele, index) {
    //date logic

    let currentDate = new Date(user.transactionsDates[index]);
    let gdate = String(currentDate.getDate()).padStart(2, 0);
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, 0);
    let daysDiff = Math.round(
      Math.abs(new Date() - currentDate) / (1000 * 60 * 60 * 24)
    );

    let dateDisplay = `${gdate}/${month}/${year}`;
    if (daysDiff === 0) dateDisplay = "TODAY";
    if (daysDiff === 1) dateDisplay = "YESTERDAY";
    let type = ele > 0 ? "deposit" : "withdrawal";
    let html = `<div class="trans-row">
              <div class="trans-type ${type}">${index + 1} ${type}</div> 
              <div class="trans-date">${dateDisplay}</div> 
              <div class="trans-value">${ele.toFixed(2)}$</div>
            </div>`;
    transactionRows.insertAdjacentHTML("afterbegin", html);
  });
};

//display the total account balance

displayBalance = function (account) {
  totalBalance =
    account.transactions.length &&
    account.transactions.reduce(function (acc, value) {
      return acc + value;
    });
  document.querySelector(".amount").textContent = `${totalBalance.toFixed(2)}$`;
};

//displaying the summary values

displaySummary = function (account) {
  let inValue =
    account.transactions.length &&
    account.transactions
      .filter(function (val) {
        return val > 0;
      })
      .reduce(function (acc, val) {
        return acc + val;
      });
  summaryIn.textContent = `${inValue.toFixed(2)}$`;
  let outValue =
    account.transactions.length &&
    account.transactions
      .filter(function (val) {
        return val < 0;
      })
      .reduce(function (acc, val) {
        return acc + val;
      });
  summaryOut.textContent = `${Math.abs(outValue).toFixed(2)}$`;
  summaryInterest.textContent = `${((inValue * 1.2) / 100).toFixed(2)}$`;
};

//login
btnSignIn.addEventListener("click", function (e) {
  e.preventDefault(); //prevent form from submitting
  signupForm.style.display = "none";
  logginedUser = accounts.find(function (user) {
    return user.owner === userName.value;
  });
  clearInterval(sInter);
  logOutTimer();

  if (logginedUser !== undefined)
    if (logginedUser.pin === Number(loginPin.value)) {
      mainEle.style.visibility = "visible";
      userName.value = "";
      loginPin.value = "";

      //display transactions
      displayTransactions(logginedUser);
      displayBalance(logginedUser); // total balance
      displaySummary(logginedUser); //account summary
    } else {
      alert("Incorrect pin");
    }
  else alert("Incorrect User");
});

//reset logout timer
document.querySelector("body").addEventListener("click", function () {
  clearInterval(sInter);
  logOutTimer();
});

//operations

/* Transfer money */

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  let transferTo = document.querySelector(".input-to").value;
  let transferAmount = document.querySelector(".input-amount").value;
  let userTo = accounts.find(function (account) {
    return account.owner === transferTo;
  });
  if (transferTo === "") alert("Please fill the fields");
  else {
    if (
      userTo !== undefined &&
      transferAmount > 0 &&
      transferAmount <= totalBalance &&
      userTo !== logginedUser
    ) {
      userTo.transactions.push(Math.abs(Number(transferAmount)));
      userTo.transactionsDates.push(new Date());

      logginedUser.transactions.push(-Math.abs(Number(transferAmount)));
      logginedUser.transactionsDates.push(new Date());

      displayTransactions(logginedUser);
      displayBalance(logginedUser); // total balance
      displaySummary(logginedUser); //account summary
    } else {
      alert("check the username and amount");
    }
  }
});

//request loan

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  let enteredAmount = Number(
    document.querySelector(".input-loan-amount").value
  );
  if (enteredAmount > 0) {
    logginedUser.transactions.push(enteredAmount);
    logginedUser.transactionsDates.push(new Date());
    displayTransactions(logginedUser);
    displayBalance(logginedUser); // total balance
    displaySummary(logginedUser); //account summary
  } else {
    alert("Aount field should be positive");
  }
});

//close account

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  let enteredUser = document.querySelector(".input-user").value;
  let enteredPin = Number(document.querySelector(".input-pin").value);
  if (logginedUser.owner === enteredUser && logginedUser.pin === enteredPin) {
    let closeAccount = accounts.find(function (account) {
      return account.owner === enteredUser;
    });
    accounts.splice(accounts.indexOf(closeAccount), 1);
    mainEle.style.visibility = "hidden";
  } else {
    alert("Invalid details");
  }
});
