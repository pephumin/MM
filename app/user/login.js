"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNavigatingTo = onNavigatingTo;
exports.onTextChange = onTextChange;
const user_instance_1 = require("./user-instance");
const util_1 = require("~/common/util");
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = user_instance_1.UserViewModelInstance;
}
// export function onNavigatingToDestination(args: EventData) {
//   const page = <Page>args.object;
//   page.bindingContext = UserViewModelInstance;
//   let destination: string;
//   const LinkId = (args.object as any).id;
//   console.log(LinkId);
//   if (LinkId === 'link1') { destination = '~/user/registration'; } 
//   else if (LinkId === 'link2') { destination = '~/user/forgot-password'; }
//   else if (LinkId === 'link3') { destination = '~/user/login'; }
//   else if (LinkId === 'link4') { destination = '~/home/fhome'; }
//   Frame.topmost().navigate(destination);
// }
function onTextChange(args) {
    const textField = args.object;
    console.log('TextField text changed:', textField.text);
    const updatedValue = (0, util_1.LowerCase)(args.value);
    console.log('New value:', updatedValue);
    if (textField.text !== args.value) {
        textField.text = updatedValue;
    }
}
