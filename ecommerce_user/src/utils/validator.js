// import { isEmail, isEmpty } from 'validator';


// export const required = (value) => {
//     if (isEmpty(value)) {
//         return <small className="form-text text-danger">This field is required</small>;
//     }
// }

// export const email = (value) => {
//     if (!isEmail(value)) {
//         return <small className="form-text text-danger">Invalid email format</small>;
//     }
// }

// export const minLength = (value) => {
//     if (value.trim().length < 6) {
//         return <small className="form-text text-danger">Password must be at least 6 characters long</small>;
//     }
// }
import methods from 'validator';

class Validator {
  constructor(rules) {
    this.rules = rules;
    this.initiate();
  }

  initiate() {
    this.isValid = true;
    this.errors = {};
  }

  validate(state) {
    this.initiate();
    this.rules.forEach((rule) => {
      if (this.errors[rule.field]) return;

      const fieldValue = state[rule.field] || '';
      const args = rule.args || [];
      const validationMethod = typeof rule.method === 'string'
        ? methods[rule.method]
        : rule.method;

      if (validationMethod(fieldValue, ...args, state) !== rule.validWhen) {
        this.errors[rule.field] = rule.message;
        this.isValid = false;
      }
    });
    return this.errors;
  }
}

export default Validator;