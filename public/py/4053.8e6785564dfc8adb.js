"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[4053],{4053:(Q,_,s)=>{s.r(_),s.d(_,{AddPageModule:()=>q});var g=s(6895),r=s(4719),u=s(7479),c=s(5012),p=s(5861),e=s(6738),A=s(1228),f=s(6141);function h(n,d){if(1&n&&(e.TgZ(0,"ion-select-option",27),e._uU(1),e.qZA()),2&n){const t=d.$implicit;e.Q6J("value",t.id),e.xp6(1),e.Oqu(t.name)}}function M(n,d){1&n&&e._UZ(0,"ion-spinner")}function Z(n,d){if(1&n){const t=e.EpF();e.TgZ(0,"ion-item")(1,"ion-label"),e._uU(2,"\u0627\u0633\u062a\u0644\u0627\u0645 \u0645\u0646:"),e.qZA(),e.TgZ(3,"ion-select",24,25),e.NdJ("ngModelChange",function(i){e.CHM(t);const a=e.oxw();return e.KtG(a.add_data.from_id=i)}),e.YNc(5,h,2,2,"ion-select-option",26),e.qZA(),e.YNc(6,M,1,0,"ion-spinner",11),e.qZA()}if(2&n){const t=e.oxw();e.xp6(3),e.Q6J("ngModel",t.add_data.from_id),e.xp6(2),e.Q6J("ngForOf",t.users),e.xp6(1),e.Q6J("ngIf",t.loading)}}function T(n,d){1&n&&(e.TgZ(0,"ion-label"),e._uU(1,"\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645:"),e.qZA())}function v(n,d){1&n&&(e.TgZ(0,"ion-label"),e._uU(1,"\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u062f\u0641\u0639:"),e.qZA())}function y(n,d){if(1&n){const t=e.EpF();e.TgZ(0,"ion-datetime",28,29),e.NdJ("ngModelChange",function(i){e.CHM(t);const a=e.oxw();return e.KtG(a.add_data.date=i)}),e.qZA()}if(2&n){const t=e.oxw();e.Q6J("showDefaultButtons",!0)("ngModel",t.add_data.date)}}function x(n,d){1&n&&(e.TgZ(0,"div"),e._uU(1," \u0627\u0644\u0642\u064a\u0645\u0629 \u0645\u0637\u0644\u0648\u0628\u0629 "),e.qZA())}function J(n,d){1&n&&(e.TgZ(0,"div"),e._uU(1," \u0627\u0644\u0642\u064a\u0645\u0629 \u0645\u0648\u062c\u0628\u0629 "),e.qZA())}function P(n,d){if(1&n&&(e.TgZ(0,"div",30),e.YNc(1,x,2,0,"div",11),e.YNc(2,J,2,0,"div",11),e.qZA()),2&n){e.oxw();const t=e.MAs(33);e.xp6(1),e.Q6J("ngIf",null==t.errors?null:t.errors.required),e.xp6(1),e.Q6J("ngIf",null==t.errors?null:t.errors.pattern)}}const C=[{path:"",component:(()=>{class n{constructor(t,o,i,a){this.auth=t,this.api=o,this.router=i,this.toastController=a,this.loading=!1,this.pay=1,this.add_data={from_id:null,date:"",amount:"",currency:"",notes:""}}ngOnInit(){this.get_all_users()}get_all_users(){this.loading=!0,this.api.get_all_users(this.auth.user.id).subscribe(o=>{this.loading=!1,this.users=o},o=>{this.loading=!1,console.log(o)})}add(t){const o=this.auth.user.id;let i=new Date(this.add_data.date);const a=new Date;i.setHours(a.getHours(),a.getMinutes(),a.getSeconds(),a.getMilliseconds()),this.add_data.date=i.toISOString();let l=Object.assign({},this.add_data,{to_id:o});console.log(l),2==this.pay&&(l.from_id=this.auth.user.id,l.to_id=-1),this.api.add_rec(l).subscribe(m=>{this.showMsg("\u062a\u0645\u062a \u0627\u0644\u0627\u0636\u0627\u0641\u0629 \u0628\u0646\u062c\u0627\u062d...",6),this.clearForm(t),this.router.navigate(["main"])},m=>{console.log(m)})}clearForm(t){t.resetForm(),this.add_data={from_id:null,date:"",amount:"",currency:"",notes:""},this.pay=1}showMsg(t,o=5){var i=this;return(0,p.Z)(function*(){(yield i.toastController.create({message:t,duration:1e3*o,color:"success"})).present()})()}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(A.e),e.Y36(f.N),e.Y36(c.F0),e.Y36(u.yF))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-add"]],decls:53,vars:14,consts:[[3,"translucent"],["slot","start"],[3,"ngSubmit"],["addform","ngForm"],["color","primary","justify-content-center",""],["align-self-center","","size-md","12","size-lg","12","size-xs","12"],["padding",""],["name","pay",3,"ngModel","ngModelChange"],["value","1"],["value","2","color","danger"],["color","danger"],[4,"ngIf"],["id","date","name","date","ngModel","","readonly","true","required","",1,"ion-text-end",3,"value"],["trigger","date","size","cover","dir","ltr"],["id","amount","name","amount","type","number","min","0","step","0.5","inputmode","decimal","pattern","[0-9]+","placeholder","\u0627\u0644\u0642\u064a\u0645\u0629","required","",3,"ngModel","ngModelChange"],["amount","ngModel"],["class","alert",4,"ngIf"],["id","currency","name","currency","required","","placeholder","\u0627\u0644\u0646\u0648\u0639:","okText","\u0645\u0648\u0627\u0641\u0642","cancelText","\u0625\u0644\u063a\u0627\u0621",3,"ngModel","ngModelChange"],["currency","ngModel"],["value","s1"],["value","s2"],["placeholder","\u0645\u0644\u0627\u062d\u0638\u0627\u062a","id","notes","name","notes",3,"ngModel","ngModelChange"],["notes","ngModel"],["size","large","type","submit","expand","block",3,"disabled"],["name","from_id","required","","placeholder","\u0627\u0633\u062a\u0644\u0627\u0645 \u0645\u0646:","okText","\u0645\u0648\u0627\u0641\u0642","cancelText","\u0625\u0644\u063a\u0627\u0621",3,"ngModel","ngModelChange"],["from_id","ngModel"],[3,"value",4,"ngFor","ngForOf"],[3,"value"],["presentation","date","size","cover","locale","ar-sy","name","date","doneText","\u0645\u0648\u0627\u0641\u0642","cancelText","\u0625\u0644\u063a\u0627\u0621",3,"showDefaultButtons","ngModel","ngModelChange"],["date","ngModel"],[1,"alert"]],template:function(t,o){if(1&t){const i=e.EpF();e.TgZ(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-buttons",1),e._UZ(3,"ion-menu-button"),e.qZA(),e.TgZ(4,"ion-title"),e._uU(5,"\u0625\u0636\u0627\u0641\u0629 \u0627\u064a\u0635\u0627\u0644 \u062c\u062f\u064a\u062f"),e.qZA()()(),e.TgZ(6,"ion-content")(7,"form",2,3),e.NdJ("ngSubmit",function(){e.CHM(i);const l=e.MAs(8);return e.KtG(o.add(l))}),e.TgZ(9,"ion-grid")(10,"ion-row",4)(11,"ion-col",5)(12,"div",6)(13,"ion-item")(14,"ion-segment",7),e.NdJ("ngModelChange",function(l){return o.pay=l}),e.TgZ(15,"ion-segment-button",8)(16,"ion-label"),e._uU(17,"\u0642\u0628\u0636"),e.qZA()(),e.TgZ(18,"ion-segment-button",9)(19,"ion-label",10),e._uU(20,"\u062f\u0641\u0639"),e.qZA()()()(),e.YNc(21,Z,7,3,"ion-item",11),e.TgZ(22,"ion-item"),e.YNc(23,T,2,0,"ion-label",11),e.YNc(24,v,2,0,"ion-label",11),e._UZ(25,"ion-input",12),e.ALo(26,"date"),e.TgZ(27,"ion-popover",13),e.YNc(28,y,2,2,"ng-template"),e.qZA()(),e.TgZ(29,"ion-item")(30,"ion-label"),e._uU(31,"\u0627\u0644\u0642\u064a\u0645\u0629:"),e.qZA(),e.TgZ(32,"ion-input",14,15),e.NdJ("ngModelChange",function(l){return o.add_data.amount=l}),e.qZA(),e.YNc(34,P,3,2,"div",16),e.qZA(),e.TgZ(35,"ion-item")(36,"ion-label"),e._uU(37,"\u0627\u0644\u0646\u0648\u0639:"),e.qZA(),e.TgZ(38,"ion-select",17,18),e.NdJ("ngModelChange",function(l){return o.add_data.currency=l}),e.TgZ(40,"ion-select-option",19),e._uU(41,"\u0628\u0644\u0627\u0633\u062a\u064a\u0643"),e.qZA(),e.TgZ(42,"ion-select-option",20),e._uU(43,"\u062e\u064a\u0648\u0637"),e.qZA()()(),e.TgZ(44,"ion-item")(45,"ion-label"),e._uU(46,"\u0645\u0644\u0627\u062d\u0638\u0627\u062a:"),e.qZA(),e.TgZ(47,"ion-textarea",21,22),e.NdJ("ngModelChange",function(l){return o.add_data.notes=l}),e.qZA()()(),e._UZ(49,"br"),e.TgZ(50,"div",6)(51,"ion-button",23),e._uU(52,"\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0627\u064a\u0635\u0627\u0644"),e.qZA()()()()()()()}if(2&t){const i=e.MAs(8),a=e.MAs(33);e.Q6J("translucent",!0),e.xp6(14),e.Q6J("ngModel",o.pay),e.xp6(7),e.Q6J("ngIf",1==o.pay),e.xp6(2),e.Q6J("ngIf",1==o.pay),e.xp6(1),e.Q6J("ngIf",2==o.pay),e.xp6(1),e.s9C("value",e.xi3(26,11,o.add_data.date,"dd/MM/yyyy")),e.xp6(7),e.Q6J("ngModel",o.add_data.amount),e.xp6(2),e.Q6J("ngIf",a.invalid&&(a.dirty||a.touched)),e.xp6(4),e.Q6J("ngModel",o.add_data.currency),e.xp6(9),e.Q6J("ngModel",o.add_data.notes),e.xp6(4),e.Q6J("disabled",i.invalid)}},dependencies:[g.sg,g.O5,r._Y,r.JJ,r.JL,r.Q7,r.c5,r.On,r.F,u.YG,u.Sm,u.wI,u.W2,u.x4,u.jY,u.Gu,u.pK,u.Ie,u.Q$,u.fG,u.d8,u.Nd,u.cJ,u.GO,u.t9,u.n0,u.PQ,u.g2,u.sr,u.wd,u.as,u.QI,u.j9,g.uU]}),n})()}];let b=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[c.Bz.forChild(C),c.Bz]}),n})(),q=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[g.ez,r.u5,u.Pc,b]}),n})()}}]);