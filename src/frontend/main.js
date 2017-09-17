import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import css from './style.css';
import FlipMove from 'react-flip-move';

const DEFAULT_PASSWORD_LENGTH = 20;

//Lang arrays
const langRu = {
    appAuthor: <div className="app-author">Создатель: <a target="_blank" href="https://ivankorolenko.com" className="app-author__link">Иван Короленко</a></div>,
    appHeader: "Генератор паролей",
    passwordText: "Ваш надежный пароль готов!",
    createPassButton: "Создать новый пароль",
    passwordCopyMessage: "Пароль скопирован в Ваш буфер обмена",
    lengthInputLabel: "Длина пароля: ",
    lengthErrorMessage: "Длина надежного пароля должна быть не менее 15 символов!"
};

const langEn = {
    appAuthor: <div className="app-author">Creator: <a target="_blank" href="https://ivankorolenko.com/en/" className="app-author__link">Ivan Korolenko</a></div>,
    appHeader: "Password generator",
    passwordText: "Your secure password is ready!",
    createPassButton: "Сreate new password",
    passwordCopyMessage: "Password has been copied to your clipboard",
    lengthInputLabel: "Password length: ",
    lengthErrorMessage: "The length of a strong password must be at least 15 characters!"  
};

/*------------------- FUNCTIONS -------------------*/

const langDefiner = () => {
    if(navigator.language === "ru") return langRu
    else return langEn
};

//Generate new pass func
const createPass = (length = DEFAULT_PASSWORD_LENGTH) => {

    let characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890",
        password = "";
    for (let x = 0; x < length; x++) {
        let i = Math.floor(Math.random() * characters.length);
        password += characters.charAt(i);
    }
    
    return password;
};


/*------------------- FUNCTIONS END -------------------*/

/*------------------- COMPONENTS -------------------*/

const AppAuthor = props => <h1 className="app-author">{langDefiner().appAuthor}</h1>;

const AppHeader = props => <h1 className="app-h1">{langDefiner().appHeader}</h1>;


class Password extends Component {
    constructor(props){
        super(props);
    }
    
    handleFocus = (e) => {
        this.props.onFocus(e, this.props); 
  }
       
    render() {
        return (
            <FlipMove duration={500} appearAnimation="elevator" leaveAnimation="elevator" className="password-container">
                <div className="password-text">
                    {langDefiner().passwordText}
                </div>
                <input type="text" className="password" spellCheck="false" 
                    value={this.props.pass} 
                    onFocus={this.handleFocus} 
                    readOnly />
                { 
                    this.props.copyMessage === true &&
                        <p className="password-copy-message">{langDefiner().passwordCopyMessage}</p> 
                }
            </FlipMove>
        );
    }   
}

class CreatePassButton extends Component {
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick(e) {
        this.props.onClick(e, this.props);
  }

  render() {
      return  (
          <button className="create-pass-button" onClick={this.onClick}>{langDefiner().createPassButton}</button>
      );
  }
}

class LengthInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            value: this.props.length
        };
    }
    
    handleChange = (e) => {
        this.setState({ value: event.target.value });
  }
    
    handleOnBlur = (e) => {
        this.props.onBlur(e, this.props); 
    }
       
    render() {
        return (
            <FlipMove duration={500} appearAnimation="elevator" leaveAnimation="elevator" className="length-input-container">
                <label htmlFor="length-input" className="length-input-label">
                    {langDefiner().lengthInputLabel}
                </label>
                
                <input type="number" id="length-input" className="length-input" min="15"
                    value={ this.state.value } 
                    onChange={this.handleChange}
                    onBlur={this.handleOnBlur} />
                {
                    this.props.errorMessage === true &&
                        <p className="length-error-message">{langDefiner().lengthErrorMessage}</p>
                }
            </FlipMove>
        );
    }   
}

//Main component   
class PassGenerator extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            password: createPass(),
            length: DEFAULT_PASSWORD_LENGTH,
            errorMessage: false,
            copyMessage: false
        };
    }
    
    //Select the whole value of password, copy it to clipboard and update the state
    onPasswordFocus = (e) => {
        e.target.select();
        document.execCommand('Copy');
        this.setState({ copyMessage: true });
    }
    
    onLengthInputBlur = (e) => {
        
        let lengthNow = e.target.value;

       this.setState({ length: lengthNow });
    }
        
    onButtonClick = (e) => {
        e.preventDefault();
        
        let length = this.state.length;

        console.log(this.state.length);
        
        //Check if chosen password length is not less then recommended
        if(this.state.length < 15) {
           this.setState({ errorMessage: true });
        }
        else {
           this.setState({ errorMessage: false, copyMessage: false, password: createPass(length) }); 
        }      
    }
    
  render() {
      return (
          <FlipMove duration={500} appearAnimation="elevator" leaveAnimation="elevator" className="passgen-container">
            <Password pass={this.state.password} copyMessage={this.state.copyMessage} onFocus={this.onPasswordFocus}/>
            <CreatePassButton onClick={this.onButtonClick}/>
            <LengthInput length={this.state.length} onBlur={this.onLengthInputBlur} errorMessage={this.state.errorMessage}/>
          </FlipMove>
      );
  }     
}

class App extends Component {
    constructor(props){
        super(props);
    }
 
  render() {
    return (
        <div className="app column white">
            <AppAuthor />
                <AppHeader />
                    <PassGenerator />
        </div>
    );

  }
}

/*------------------- COMPONENTS END-------------------*/

ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
