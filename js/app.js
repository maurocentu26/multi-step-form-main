document.addEventListener("DOMContentLoaded", () => {
   const pageSteps = document.querySelector(".step");
   const steps = document.querySelector(".step").children;
   const form = document.querySelector(".page__form");
   const name = form.querySelector("#name");
   const email = form.querySelector("#email");
   const phoneNumber = form.querySelector("#phone-number");
   const plans = document.querySelectorAll(".page__plans-item");
   const switchPlanButton = document.querySelector(".plan__switch");
   const addons = document.querySelector(".page__addons");
   const summary = document.querySelector(".summary__details");
   const stepsUl = document.querySelectorAll(".step__number");

   let page = 0;
   let pageValid = false;
   //Variables for the form:
   let nameValid = false;
   let emailValid = false;
   let phoneNumberValid = false;
   //Creating the object.
   let planData = {
      name: "",
      type: "Monthly",
      price: "",
      addons: [],
   }

   addingEventListener();

   //Adding event listeners.
   function addingEventListener () {
      pageSteps.addEventListener("click", changePage);
      name.addEventListener("blur", validateForm);
      email.addEventListener("blur", validateForm);
      phoneNumber.addEventListener("blur", validateForm);
      plans.forEach((p, index) => {
         p.addEventListener("click", () =>{
            selectPlan(p, index);
         });
      });
      addons.addEventListener("click", addAddOn);
      switchPlanButton.addEventListener("click", switchPlan);
   }

   //Functions:
   //Next page function:
   function changePage (e) {
      const currentPage = e.target.parentElement;

      if (!pageValid && currentPage.getAttribute("id") === "personal-info"){
         if(name.value.trim() === "") createAlert(`El campo ${name.getAttribute("id")} es obligatorio.`, name);
         if(email.value.trim() === "") createAlert(`El campo ${email.getAttribute("id")} es obligatorio.`, email);
         if(phoneNumber.value.trim() === "") createAlert(`El campo ${phoneNumber.getAttribute("id")} es obligatorio.`, phoneNumber);
      }

      if (!pageValid && currentPage.getAttribute("id") === "select-plan"){
         const alertExists = currentPage.querySelector(".validate__input");
         if (alertExists) alertExists.remove();

         const alert = document.createElement("SPAN");
         alert.classList.add("validate__input");
         alert.innerHTML = "You have to select a plan";

         currentPage.appendChild(alert);
      }

      if (!pageValid && currentPage.getAttribute("id") === "add-ons"){
         const alertExists = currentPage.querySelector(".validate__input");
         if (alertExists) alertExists.remove();

         const alert = document.createElement("SPAN");
         alert.classList.add("validate__input");
         alert.innerHTML = "You have to select an add-on";

         currentPage.appendChild(alert);
      }

      if(e.target.classList.contains("next") && pageValid){
         if(currentPage.getAttribute("id") === "add-ons"){
            showSummary();
         }

         pageValid = false;

         stepsUl[page].classList.remove("active");
         currentPage.classList.remove("active");

         page++;

         steps[page].classList.add("active");
         stepsUl[page].classList.add("active");

         
      } else if(e.target.classList.contains("back")) {
         pageValid = true;

         currentPage.classList.remove("active");
         stepsUl[page].classList.remove("active");

         page--;

         steps[page].classList.add("active");
         stepsUl[page].classList.add("active");
      } else if(e.target.classList.contains("confirm")) {
         currentPage.classList.remove("active");

         page++;

         steps[page].classList.add("active");
      }
   }

   //Validate form function:
   function validateForm (e) {
      if(e.target.value.trim() === "") {
         createAlert(`El campo ${e.target.getAttribute("id")} es obligatorio.`, e.target)
         
         switch(e.target.getAttribute("id")) {
            case "name":
               nameValid = false;
               break;
            case "email":
               emailValid = false;
               break;
            case "phone-number":
               phoneNumberValid = false;
               break;
            default: null;
         }
      } else {
         clearAlert(e.target.parentElement, e.target.getAttribute("id"));

         switch(e.target.getAttribute("id")) {
            case "name":
               nameValid = true;
               break;
            case "email":
               emailValid = true;
               break;
            case "phone-number":
               phoneNumberValid = true;
               break;
            default: null;
         }
      }

      if (nameValid && emailValid && phoneNumberValid) pageValid = true;
      else pageValid = false;
   }

   //Function to create the alert for the form inputs.
   function createAlert(mensaje, input){
      clearAlert(input.parentElement, input.getAttribute("id"));

      const alert = document.createElement("SPAN");
      alert.textContent = mensaje;
      alert.classList.add("validate__input");

      input.classList.add("no-valid");

      input.parentElement.appendChild(alert);
   }

   //Function to clear alert for the form.
   function clearAlert(input, id) {
      const alert = input.querySelector(".validate__input");
      if (alert) alert.remove();

      input.querySelector(`#${id}`).classList.remove("no-valid");
   }

   //Function to select a plan.
   function selectPlan(plan, index) {
      pageValid = true;

      clearAllPlans();

      const title = plan.querySelector(".plan__title").textContent;
      const price = Number(plan.querySelector("#plan-price").textContent);
      plans[index].classList.add("selected");

      const alert = switchPlanButton.parentElement.parentElement.querySelector(".validate__input");
      if (alert) alert.remove();

      planData.name = title;
      planData.price = price;
   }

   //Function to switch a plan monthly or yearly.
   function switchPlan() {
      const addons = document.querySelectorAll(".page__addons-item");
      if(switchPlanButton.classList.contains("monthly")){
         monthlyPlan(addons);
      } else {
         yearlyPlan(addons);
      }
      planData.type = plans[0].parentElement.parentElement.querySelector(".plan__type-item.selected").textContent.trim();
      planData.price = Number(plans[0].parentElement.querySelector(".selected").querySelector("#plan-price").textContent);
      planData.addons = [];
   }

   //Function to switch a monthly plan.
   function monthlyPlan(addons) {
      switchPlanButton.classList.remove("monthly");
      switchPlanButton.classList.add("yearly");

      switchPlanButton.previousElementSibling.classList.toggle("selected");
      switchPlanButton.nextElementSibling.classList.toggle("selected");

      plans.forEach( plan => {
         const price = plan.querySelector("#plan-price").textContent * 10;

         let monthPromotion = document.createElement("SPAN");
         monthPromotion.classList.add("month-promotion");
         monthPromotion.classList.add("absolute");
         monthPromotion.innerHTML = "2 months free";
         
         plan.querySelector("#plan-price").textContent = price;
         plan.appendChild(monthPromotion);
      });
      addons.forEach(a => {
         a.querySelector(".addon__price").innerHTML = `+<span id="addon-price">${a.querySelector("#addon-price").textContent * 10}</span>/yr`;
         a.querySelector(".addon__checkbox").checked = false;
      })
   }

   //Function to switch a yearly plan.
   function yearlyPlan(addons){
      switchPlanButton.classList.remove("yearly");
      switchPlanButton.classList.add("monthly");
   
      switchPlanButton.previousElementSibling.classList.toggle("selected");
      switchPlanButton.nextElementSibling.classList.toggle("selected");

      plans.forEach( plan => {
         price = plan.querySelector("#plan-price").textContent / 10;

         monthPromotion = plan.querySelector(".month-promotion");
         if (monthPromotion) monthPromotion.remove();

         plan.querySelector("#plan-price").textContent = price;
      });
      addons.forEach(a => {
         a.querySelector(".addon__price").innerHTML = `+<span id="addon-price">${a.querySelector("#addon-price").textContent / 10}</span>/mo`;
         a.querySelector(".addon__checkbox").checked = false;
      });
   }

   //Function to clear all selected plans.
   function clearAllPlans() {
      plans.forEach(p => p.classList.remove("selected"));
   }

   //Function to add an AddOn.
   function addAddOn(e) {
      if (e.target.classList.contains("addon__checkbox")){
         if (e.target.checked) {
            pageValid = true;

            const alert = e.target.parentElement.parentElement.parentElement.querySelector(".validate__input");
            if (alert) alert.remove();

            e.target.parentElement.classList.add("selected");

            const _addon = {
               name: e.target.parentElement.querySelector(".addon__title").textContent,
               price: Number(e.target.parentElement.querySelector("#addon-price").textContent),
            };

            planData.addons.push(_addon);
         } else {
            e.target.parentElement.classList.remove("selected");
            planData.addons = planData.addons.filter(__addon => __addon.name !== e.target.parentElement.querySelector(".addon__title").textContent);

            if (planData.addons.length > 0) {
               const alert = e.target.parentElement.parentElement.parentElement.querySelector(".validate__input");
               if (alert) alert.remove();
            } else pageValid = false;
      }
   }
   }

   //Function to show the summary.
   function showSummary(){
      let totalPay = 0;
      summary.innerHTML = "";
      const {name, type, price, addons} = planData;
      const mainRow = document.createElement("DIV");

      totalPay += price;

      mainRow.classList.add("row");
      mainRow.innerHTML = `
         <div class="plan__container">
            <h3 class="sumary__plan-title">${name} (${type})</h3>
         </div>
         <span class="addon__price-selected bold">$${price}/${(type === "Yearly") ? "yr" : "mo"}</span>
      `

      summary.appendChild(mainRow);
      summary.appendChild(document.createElement("HR"));

      addons.forEach(addon => {
         const row = document.createElement("DIV");
         row.classList.add("row");
         row.innerHTML = `
            <span class="addon__description">${addon.name}</span>
            <span class="addon__price-selected">$${addon.price}/${(type === "Yearly") ? "yr" : "mo"}</span>
         `
         summary.appendChild(row);
         totalPay += addon.price;
      });

      const summaryTotal = summary.parentElement.querySelector(".summary__payment-final");
      summaryTotal.innerHTML = "";

      const totalPaymentType = document.createElement("SPAN");
      totalPaymentType.classList.add("addon__description");
      totalPaymentType.innerHTML = (type === "Yearly" ? "Total (per year)" : "Total (per month)");

      const priceTotal = document.createElement("SPAN");    
      priceTotal.classList.add("summary__total");
      priceTotal.innerHTML = `+${totalPay}/${(type === "Yearly") ? "yr" : "mo"}`;

      summaryTotal.appendChild(totalPaymentType);
      summaryTotal.appendChild(priceTotal);
   }
})