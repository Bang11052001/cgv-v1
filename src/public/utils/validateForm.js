function validator(form,option) {
var formElement = document.querySelector(form);
var formRule = [];
var data;

var validatorRules = {
    name : function(value){
        console.log(value.toLowerCase())
        var regex = /^([a-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+)((\s{1}[a-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+){1,})$/i;
        return regex.test(value.toLowerCase()) ? undefined : 'Tên phải có it nhất 2 từ và không chứa số!';
    },
    email : function(value) {
        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(value) ? undefined : 'Email không chính xác';
    },
    phone : function(value) {
        var regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        return regex.test(value) ? undefined : 'Số điện thoại không chính xác';
    },
    required : function(value) {
        return value !=='' ? undefined : 'Vui lòng nhập trường này!';
    },
    password : function(value){
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(value) ? undefined : 'Mật khẩu phải lớn hơn 8 kí tự có ít nhất 1 chữ cái hoa và thường, 1 kí tự đặc biệt !';
    },
    passwordConfirm : function(value){
        return (value == data.passwordValue && data.isValid) ? undefined : 'mat khau khong chinh xac';
    },
    emailExist : function(value){
        var result ='';
            $.ajax({
                url: '/api/user',
                type: 'POST',
                async: false,
                data: {
                    email : value,
                },
                success: function (data){
                    if(data.length > 0){
                        console.log(data)
                        result = 'Email đã tồn tại!';
                    }
                    else{
                        result = undefined;
                    }
                }
            })
        return result;
    },
    phoneExist : function(value){
        var result ='';
            $.ajax({
                url: '/api/user',
                type: 'POST',
                async: false,
                data: {
                    phone : value
                },
                success: function (data){
                    if(data.length > 0){
                        result = 'Số điện thoại đã tồn tại!';
                    }
                    else{
                        result = undefined;
                    }
                }
            })
        return result;
    }
}

// ham validator
function handelValidator(elementsCheck) {
    var errorElement = elementsCheck.closest('.form-group').querySelector('.form-message');
    var formGroup = elementsCheck.closest('.form-group');
        
        var rules = formRule[elementsCheck.name];
        for(var i in rules){
            // lay data password de confirm password
            if(elementsCheck.name == 'password'){
                passwordValue = elementsCheck.value;
                isValid = !(rules[i](elementsCheck.value));
                data ={
                    passwordValue: passwordValue,
                    isValid: isValid
                }
            }

            if(elementsCheck.classList.contains('form-gender-date')){
                if(Array.from(elementsCheck.querySelectorAll('input')).some(input => input.checked == true) &&
                Array.from(elementsCheck.querySelectorAll('select')).every(select => select.value !== ''))
                {
                    errorMessage = (rules[i]('true'));
                }
                else{
                    errorMessage = (rules[i](''));
                }
            }
            else if(elementsCheck.getAttribute('type') == 'checkbox'){
                if(elementsCheck.checked == true){
                    errorMessage = (rules[i]('true'));
                }
                else{
                    errorMessage = (rules[i](''));
                }
            }
            else{
                errorMessage = (rules[i](elementsCheck.value));
            }

            if(errorMessage){
                errorElement.innerText = errorMessage;
                formGroup.classList.add('invalid');
                break;
            }
            else{
                errorElement.innerText = '';
                formGroup.classList.remove('invalid');
            }
        }
        return !errorMessage;
    }

    if(formElement){
        var elementsChecks = document.querySelectorAll('[rules]');
        var rules;
        elementsChecks.forEach(function(elementsCheck) {
            rules = elementsCheck.getAttribute('rules').split('|');
            rules.forEach(function(rule) {
                var ruleFunc = validatorRules[rule];
                if(Array.isArray(formRule[elementsCheck.name])){
                    formRule[elementsCheck.name].push(ruleFunc);
                }
                else{
                    formRule[elementsCheck.name] = [ruleFunc];
                }
            })
        })


        // su ly su kien click va blur
        elementsChecks.forEach(function(elementsCheck) {
            elementsCheck.onblur = function(){
                handelValidator(elementsCheck);
            }
            elementsCheck.onclick = function(){
                var errorElement = elementsCheck.closest('.form-group').querySelector('.form-message');
                var formGroup = elementsCheck.closest('.form-group');
                if(formGroup.classList.contains('invalid')){
                    formGroup.classList.remove('invalid');
                    errorElement.innerText = '';
                }
            }
        })
        
        // su ly su kien submit
        formElement.onsubmit = function(e) {
            var isTrue = [];
            var data ={};
            e.preventDefault();
            elementsChecks.forEach(function(elementsCheck) {
                isTrue.push(handelValidator(elementsCheck));
            })
            // lay data khi click vao sub
            if(isTrue.every(curr => curr == true)){
                data = Array.from(elementsChecks).reduce(function(values,elementsCheck) {
                    if(elementsCheck.classList.contains('form-gender-date')){
                        Array.from(elementsCheck.querySelectorAll('input')).map(input =>{
                            values[input.name] = input.value;
                        })
                        Array.from(elementsCheck.querySelectorAll('select')).map(select =>{
                            values[select.name] = select.value;
                        })
                    }
                    values[elementsCheck.name] = elementsCheck.value;
                    if(elementsCheck.value == ''){
                        values[elementsCheck.name] ='';
                    }
                    return values;
                },{})
                formElement.submit();
            }
        }
    }
}