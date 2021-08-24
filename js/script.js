"use strict";

// VARS:
const isOperator = /[x/+‑]/,
  endsWithOperator = /[x+‑/]$/;

// COMPONENTS:
const Formula = (props) => {
  return (
    <div className="formulaScreen" style={{ minHeight: 20 }}>
      {props.formula}
    </div>
  );
};

const Output = (props) => {
  return <div className="outputScreen">{props.currentValue}</div>;
};

class Buttons extends React.Component {
  render() {
    return (
      <div className="buttonScreen">
        {/* First Row */}
        <button value="AC" onClick={this.props.init} className="clearStyle">
          AC
        </button>
        <button value="CE" onClick={this.props.handleCE} className="clearStyle">
          CE
        </button>
        <button
          value="±"
          onClick={this.props.handleToggleSign}
          className="clearStyle"
        >
          ±
        </button>
        <button
          value="/"
          onClick={this.props.handleOperators}
          className="operatorStyle"
        >
          ÷
        </button>

        {/* Second Row */}
        <button value="7" onClick={this.props.handleNumbers}>
          7
        </button>
        <button value="8" onClick={this.props.handleNumbers}>
          8
        </button>
        <button value="9" onClick={this.props.handleNumbers}>
          9
        </button>
        <button
          value="x"
          onClick={this.props.handleOperators}
          className="operatorStyle"
        >
          x
        </button>

        {/* Third Row */}
        <button value="4" onClick={this.props.handleNumbers}>
          4
        </button>
        <button value="5" onClick={this.props.handleNumbers}>
          5
        </button>
        <button value="6" onClick={this.props.handleNumbers}>
          6
        </button>
        <button
          value="‑"
          onClick={this.props.handleOperators}
          className="operatorStyle"
        >
          -
        </button>
        <button value="1" onClick={this.props.handleNumbers}>
          1
        </button>
        <button value="2" onClick={this.props.handleNumbers}>
          2
        </button>
        <button value="3" onClick={this.props.handleNumbers}>
          3
        </button>
        <button
          value="+"
          onClick={this.props.handleOperators}
          className="operatorStyle"
        >
          +
        </button>

        {/* Fourth Row */}
        <button
          value="0"
          onClick={this.props.handleNumbers}
          className="zeroStyle"
        >
          0
        </button>
        <button value="." onClick={this.props.handleDecimal}>
          .
        </button>
        <button
          value="="
          onClick={this.props.handleEval}
          className="operatorStyle"
        >
          =
        </button>
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
    };
    this.toggleToNegative = this.toggleToNegative.bind(this);
    this.toggleToPositive = this.toggleToPositive.bind(this);
    this.lockOperators = this.lockOperators.bind(this);
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.handleToggleSign = this.handleToggleSign.bind(this);
    this.initialize = this.initialize.bind(this);
    this.handleCE = this.handleCE.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
  }

  toggleToNegative(formula, currentVal) {
    this.setState({
      currentVal: "-" + this.state.formula.match(/(\d*\.?\d*)$/)[0],
      formula: formula.replace(
        /(\d*\.?\d*)$/,
        "(-" + this.state.formula.match(/(\d*\.?\d*)$/)[0]
      ),
      currentSign: "neg",
    });
  }

  toggleToPositive(formula, lastOpen, currentVal) {
    this.setState({
      currentSign: "pos",
    });
    if (this.state.lastClicked == "CE") {
      this.setState({
        currentVal: this.state.formula.match(/(\d+\.?\d*)$/)[0],
        formula:
          formula.substring(0, lastOpen) + formula.substring(lastOpen + 2),
      });
    } else if (currentVal == "-") {
      this.setState({
        currentVal: "0",
        formula:
          formula.substring(0, lastOpen) + formula.substring(lastOpen + 2),
      });
    } else {
      this.setState({
        currentVal: currentVal.slice(currentVal.indexOf("-") + 1),
        formula:
          formula.substring(0, lastOpen) + formula.substring(lastOpen + 2),
      });
    }
  }

  lockOperators(formula, currentVal) {
    return (
      formula.lastIndexOf(".") == formula.length - 1 ||
      formula.lastIndexOf("-") == formula.length - 1 ||
      currentVal.indexOf("Met") != -1
    );
  }

  maxDigitWarning() {
    this.setState({
      currentVal: "Digit Limit Met",
      prevVal: this.state.currentVal,
    });
    setTimeout(
      () =>
        this.setState({
          currentVal: this.state.prevVal,
        }),
      1000
    );
  }

  handleEvaluate() {
    if (!this.lockOperators(this.state.formula, this.state.currentVal)) {
      let expression = this.state.formula;
      if (endsWithOperator.test(expression))
        expression = expression.slice(0, -1);
      expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
      expression =
        expression.lastIndexOf("(") > expression.lastIndexOf(")")
          ? expression + ")"
          : expression;
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      this.setState({
        currentVal: answer.toString(),
        formula:
          expression.replace(/\*/g, "⋅").replace(/-/g, "‑") + "=" + answer,
        prevVal: answer,
        currentSign: answer[0] == "-" ? "neg" : "pos",
        lastClicked: "evaluated",
      });
    }
  }

  handleOperators(e) {
    if (!this.lockOperators(this.state.formula, this.state.currentVal)) {
      if (
        this.state.formula.lastIndexOf("(") >
        this.state.formula.lastIndexOf(")")
      ) {
        this.setState({
          formula: this.state.formula + ")" + e.target.value,
          prevVal: this.state.formula + ")",
        });
      } else if (this.state.formula.indexOf("=") != -1) {
        this.setState({
          formula: this.state.prevVal + e.target.value,
        }); // comment 1
      } else {
        this.setState({
          // comment 2
          prevVal: !isOperator.test(this.state.currentVal)
            ? this.state.formula
            : this.state.prevVal,
          formula: !isOperator.test(this.state.currentVal)
            ? (this.state.formula += e.target.value)
            : (this.state.prevVal += e.target.value),
        });
      } // operator defaults:
      this.setState({
        currentSign: "pos",
        currentVal: e.target.value,
        lastClicked: "operator",
      });
    }
  }

  handleToggleSign() {
    this.setState({
      lastClicked: "toggleSign",
    });
    if (this.state.lastClicked == "evaluated") {
      // comment 3
      this.setState({
        currentVal:
          this.state.currentVal.indexOf("-") > -1
            ? this.state.currentVal.slice(1)
            : "-" + this.state.currentVal,
        formula:
          this.state.currentVal.indexOf("-") > -1
            ? this.state.currentVal.slice(1)
            : "(-" + this.state.currentVal,
        currentSign: this.state.currentVal.indexOf("-") > -1 ? "pos" : "neg",
      });
    } else if (this.state.currentSign == "neg") {
      this.toggleToPositive(
        this.state.formula,
        this.state.formula.lastIndexOf("(-"),
        this.state.currentVal
      );
    } else {
      this.toggleToNegative(this.state.formula, this.state.currentVal);
    }
  }

  handleNumbers(e) {
    if (this.state.currentVal.indexOf("Limit") == -1) {
      this.setState({
        lastClicked: "num",
      });
      if (this.state.currentVal.length > 21) {
        this.maxDigitWarning();
      } else if (this.state.lastClicked == "CE" && this.state.formula !== "") {
        this.setState({
          currentVal: !endsWithOperator.test(this.state.formula)
            ? this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + e.target.value
            : e.target.value,
          formula: (this.state.formula += e.target.value),
        });
      } else if (this.state.formula.indexOf("=") != -1) {
        this.setState({
          currentVal: e.target.value,
          formula: e.target.value != "0" ? e.target.value : "",
        });
      } else {
        this.setState({
          currentVal:
            this.state.currentVal == "0" ||
            isOperator.test(this.state.currentVal)
              ? e.target.value
              : this.state.currentVal + e.target.value,
          formula:
            this.state.currentVal == "0" && e.target.value == "0"
              ? this.state.formula
              : /([^.0-9]0)$/.test(this.state.formula)
              ? this.state.formula.slice(0, -1) + e.target.value
              : this.state.formula + e.target.value,
        });
      }
    }
  }

  handleDecimal() {
    if (
      this.state.currentVal.indexOf(".") == -1 &&
      this.state.currentVal.indexOf("Limit") == -1
    ) {
      this.setState({
        lastClicked: this.state.lastClicked == "CE" ? "CE" : "decimal",
      }); // comment 4
      if (this.state.currentVal.length > 21) {
        this.maxDigitWarning();
      } else if (
        this.state.lastClicked == "evaluated" ||
        endsWithOperator.test(this.state.formula) ||
        (this.state.currentVal == "0" && this.state.formula === "") ||
        /-$/.test(this.state.formula)
      ) {
        this.setState({
          currentVal: "0.",
          formula:
            this.state.lastClicked == "evaluated"
              ? "0."
              : this.state.formula + "0.",
        });
      } else if (
        this.state.formula.match(/(\(?\d+\.?\d*)$/)[0].indexOf(".") > -1
      ) {
        // comment 5
      } else {
        this.setState({
          currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
          formula: this.state.formula + ".",
        });
      }
    }
  }

  initialize() {
    this.setState({
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
    });
  }

  handleCE() {
    let thisWith = new RegExp(
      /[x+‑\/]$|\d+\.?\d*$|(\(-\d+\.?\d*)$|(\(-)$|\)[x+‑\/]$/
    );
    if (this.state.formula.indexOf("=") == -1) {
      this.setState({
        formula: this.state.formula.replace(thisWith, ""),
        currentVal: "0",
        lastClicked: "CE",
      });
    }
    setTimeout(() => {
      this.setState({
        currentSign:
          this.state.formula === "" ||
          endsWithOperator.test(this.state.formula) ||
          this.state.formula.match(/(\(?-?\d+\.?\d*)$/)[0].indexOf("-") == -1
            ? "pos"
            : "neg",
      });
    }, 100);
  }

  render() {
    return (
      <div className="calculator">
        <Formula formula={this.state.formula.replace(/x/g, "⋅")} />
        <Output currentValue={this.state.currentVal} />
        <Buttons
          onClick={this.handleClick}
          handleEval={this.handleEvaluate}
          handleOperators={this.handleOperators}
          handleToggleSign={this.handleToggleSign}
          handleNumbers={this.handleNumbers}
          handleDecimal={this.handleDecimal}
          handleCE={this.handleCE}
          init={this.initialize}
        />
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("app"));
