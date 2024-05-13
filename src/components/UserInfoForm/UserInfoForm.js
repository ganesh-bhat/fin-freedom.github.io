import * as React from "react";

function BasicInfoCollector() {

  const [ age, setAge ] = React.useState(39);
  const [ retirementAge, setRetirementAge ] = React.useState(50);
  const [ monthlyExpense, setMonthlyExpense ] = React.useState(200000);
  const [ lifeExpectancy, setLifeExpectancy ] = React.useState(80);
  const [ inflationRate, setInflationRate ] = React.useState(7);
  const [ postRetirementROI, setPostRetirementROI ] = React.useState(9);
  const [ monthlyExpenseOnFreedomYear, setMonthlyExpenseOnFreedomYear ] = React.useState(0);
  const [ data, setData ] = React.useState([{year: 0, totalExpense: 0, balance: 0}]);
  const [ nestEggAmount, setNestEggAmount ] = React.useState(0);
  const [ freedomYear, setFreedomYear ] = React.useState(0);
  const [ retirementFund, setRetirementFund ] = React.useState(0);
  const [ lifeExpectancyYear, setLifeExpectancyYear ] = React.useState(0);

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    //call the set state function for the specific field dependening on name
    if (name === 'age') {
      setAge(parseInt(value));
    } else if (name === 'retirement-age') {
      setRetirementAge(parseInt(value));
    } else if (name === 'monthly-expense') {
      setMonthlyExpense(parseInt(value));
      setRetirementFund(parseInt(value)*12*20);
    } else if (name === 'life-expectancy') {
      setLifeExpectancy(parseInt(value));
    } else if (name === 'inflation-rate') {
      setInflationRate(parseInt(value));
    } else if (name === 'post-retirement-roi') {
      setPostRetirementROI(parseInt(value));
    } else if (name === 'retirement-fund') {
      setRetirementFund(parseInt(value));
    }

  }

  function calculate() {
    //calculateNestEggAmount();
    calculateRetirementFundChart();
  }

  

  function calculateMonthlyExpenseOnFreedomYear() {
    let yearsToRetire = retirementAge - age;
    //calculate monthly expense on the first year of freedom
    let expenseOnFirstYearOfFreedom = monthlyExpense * Math.pow((1 + inflationRate/100), yearsToRetire);
    setMonthlyExpenseOnFreedomYear(expenseOnFirstYearOfFreedom);
    return expenseOnFirstYearOfFreedom;
  }

  function calculateNestEggAmount() {
     let expenseOnFirstYearOfFreedom = calculateMonthlyExpenseOnFreedomYear()
     let yearsToRetire = retirementAge - age;
    //start with 10x monlthy expense from retirement year
    let nestEgg = expenseOnFirstYearOfFreedom * 12 * (yearsToRetire>10? yearsToRetire:10);
    let preNestEgg = nestEgg;

    while (true) {
      var currentMonthExpense = expenseOnFirstYearOfFreedom;
      let year = retirementAge - age;
      let currentYearExpense = 0;
      for (let i = 1; i <= year; i++) {
        currentYearExpense = (currentMonthExpense * 12) + (currentMonthExpense * 12) * (inflationRate/100);
        nestEgg = nestEgg-currentYearExpense;
        currentMonthExpense = currentYearExpense;
        if(nestEgg < 0) {
          break;
        }
      }

      if(nestEgg < 0) {
        //keep doing it until we have positive nest egg
        nestEgg = preNestEgg + expenseOnFirstYearOfFreedom * 12;
        preNestEgg = nestEgg;
      } else {
        break;
      }
    }

    setNestEggAmount(nestEgg);
  } 



  function calculateRetirementFundChart() {
    let year = lifeExpectancy - retirementAge;
    let totalExpense = 0;
    let balance = retirementFund;
    let data = [];

    var retirementStartYear = new Date().getFullYear() + ( retirementAge - age);
    setFreedomYear(retirementStartYear);

    var currentMonthExpense = calculateMonthlyExpenseOnFreedomYear();
    var currentYearExpense = currentMonthExpense*12;

    var exhausted = false;
    for (let i = 1; i <= year; i++) {
      balance = balance - currentYearExpense;

      data.push({
        count: i,
        isLastYear: i === year,
        year: retirementStartYear,
        amountNeeded: currentYearExpense,
        totalExpense: totalExpense,
        balance: balance
      });

      

      currentYearExpense = currentYearExpense + currentYearExpense * (inflationRate/100);
      balance = balance + (balance * (postRetirementROI/100));

      retirementStartYear+=1;
    }

    let j = year+1
    while(balance > 0) {
      balance = balance - currentYearExpense;
      data.push({
        count: j,
        isLastYear: false,
        year: retirementStartYear,
        amountNeeded: currentYearExpense,
        totalExpense: totalExpense,
        balance: balance
      });

      currentYearExpense = currentYearExpense + currentYearExpense * (inflationRate/100);
      balance = balance + (balance * (postRetirementROI/100));

      retirementStartYear+=1;
    }

    setData(data);

  }



  return (
    <div className="ui container">
   <h1>Basic Info</h1>
   

    <div id="about-you">

      <div className="ui message">
        <div className="header">
          Tell us little about you
        </div>
        <p>We need to know your basic details to make the caluclations. We wont use this info for any other purpose.</p>
      </div>


      <form className="ui form segment" >
              <div className="two fields">
                <div className="field">
                  <label>Name</label>
                  <input placeholder="Name" name="name" type="text"/>
                </div>
                <div className="field">
                  <label>How old are you now?</label> 
                  <input placeholder="Age" name="age" type="number" defaultValue={age} onBlur={handleInputChange}/>
                </div>
              </div>
              <div className="two fields">
                <div className="field">
                  <label>At what age would you like to be financially free?</label>
                  <input placeholder="early retirement age" name="retirement-age" type="number" defaultValue={retirementAge} onBlur={handleInputChange}/>
                </div>
              </div>
              </form>
    </div>
    <br/>
    <div id="about-finance">
      <div className="ui message">
        <div className="header">
          Tell about your expenses
        </div>
        <p>We would like to understand your monthly expense to predict your savings need and future expenses</p>
      </div>

      <form className="ui form segment">
        <div className="two fields">
          <div className="field">
            <label>What is your monthly expense?</label> 
            <input placeholder="Monthly Expense" name="monthly-expense" type="number" defaultValue={monthlyExpense} onChange={handleInputChange}/>
          </div>

          <div className="field">
            <label>What is inflation rate today on your expenses?</label> 
            <input placeholder="Inflation Rate" name="inflation-rate" type="number" defaultValue={inflationRate} onChange={handleInputChange}/>
          </div>
        </div>
      </form>
    </div>

    <br/>
    <div id="about-finance">
      <div className="ui message">
        <div className="header">
          Tell about your retirement plan
        </div>
        <p>How do you look at retirement fund? your approxmate budget and return on investment based on where you are investing.
          Example gold, real estate, mutual fund etc. Expecting more than 12% is not realistic.
        </p>
      </div>

      <form className="ui form segment">
        <div className="two fields">
          <div className="field">
            <label>What is your approximate retirement fund? ( 20x expense filled by default )</label> 
            <input placeholder="Retirment fund" name="retirement-fund" type="number" defaultValue={retirementFund} value={retirementFund} onChange={handleInputChange}/>
            <div class="ui pointing red basic label">
              Continue to calibrate this value, press calculate, until you see non-zero numbers in table.
            </div>

          </div>
          <div className="field">
            <label>Your expectation of return % on your investments ( estimate )</label> 
            <input placeholder="Post Retirement ROI" name="post-retirement-roi" type="number" defaultValue={postRetirementROI} onChange={handleInputChange}/>
          </div>
        </div>

        <div className="two fields">
          <div className="field">
              <label>Till what age you want your savings to last? (for you and your dependents, mention max)</label> 
              <input placeholder="Life-expectancy" name="life-expectancy" type="number" defaultValue={lifeExpectancy} onChange={handleInputChange}/>
            </div>
        </div>

    </form>
    </div>



    <br/>
    <center>
      <button className="ui primary button" onClick={calculate}>
      Calculate Retirement Fund Needed
      </button>
    </center>
    <br/>
    <div>
      <br/>
      <h3>Early Retirement Fund Needed: {new Intl.NumberFormat('en-IN', { style: "currency", currency: "INR",  minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseFloat(retirementFund).toFixed(2))} at the end of year </h3>
      <h2>Monthly expense on the freedom year: {freedomYear} is :{new Intl.NumberFormat('en-IN', { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseFloat(monthlyExpenseOnFreedomYear).toFixed(2))}</h2>
    </div>

    <table className="top attached ui basic table">
        <thead>
          
          <tr><th>Year</th>
          <th>End of Year</th>
          <th>Amount needed for the year</th>
          <th>Balance at the end of the year</th>
        </tr></thead>
        <tbody>
        {data.map((item) => (

          <tr key={item.year} className={`${item.balance<0 ? "negative" : item.isLastYear && item.balance>0? "positive": ""}`}>
            <td>{item.count}</td>

            <td class="item">
              {item.isLastYear && item.balance<0  && <div class="ui red horizontal label">Exhausted</div> }
              {item.isLastYear &&  <div class="ui green horizontal label">Target</div>}
              {item.year}
           </td>
            
            <td>{new Intl.NumberFormat('en-IN', { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseFloat(item.amountNeeded))}</td>
            <td>{new Intl.NumberFormat('en-IN', { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseFloat(item.balance))}</td>
          </tr>
        ))}
        </tbody>
      </table>



    </div>
    
  );
}

export default BasicInfoCollector;
