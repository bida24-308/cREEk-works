// SUBSCRIPTION PAGE: billing toggle & plan selection
(function(){
  let currentBilling = 'monthly';

  document.addEventListener('DOMContentLoaded', function(){
    initializeBillingToggle();
    initializePlanSelection();
    initializeFAQ();
  });

  function initializeBillingToggle(){
    document.querySelectorAll('.toggle-btn').forEach(btn=> btn.addEventListener('click', handleBillingChange));
  }
  function handleBillingChange(e){
    document.querySelectorAll('.toggle-btn').forEach(b=> b.classList.remove('active'));
    e.target.classList.add('active');
    currentBilling = e.target.dataset.billing || 'monthly';
    updatePrices(currentBilling);
  }
  function updatePrices(period){
    document.querySelectorAll('.amount').forEach(el=>{
      const m = parseFloat(el.dataset.monthly||'0');
      const q = parseFloat(el.dataset.quarterly||m);
      const y = parseFloat(el.dataset.yearly||m);
      let price = m;
      if(period==='quarterly') price = q; else if(period==='yearly') price = y;
      el.style.transition='opacity .2s ease'; el.style.opacity='0.5';
      setTimeout(()=>{ el.textContent = price.toFixed(0); el.style.opacity='1'; }, 120);
    });
  }

  function initializePlanSelection(){
    document.querySelectorAll('.plan-card .btn').forEach(btn=> btn.addEventListener('click', handlePlanSelection));
  }
  function handlePlanSelection(e){
    e.preventDefault();
    const card = e.target.closest('.plan-card');
    const planName = card.querySelector('h3')?.textContent ?? 'Plan';
    const amount = card.querySelector('.amount')?.textContent ?? '0';
    FreshBite.Storage.set('selectedPlan', { name: planName, price: amount, billing: currentBilling, timestamp: new Date().toISOString() });
    FreshBite.Analytics.trackEvent('Subscription','PlanSelected', planName);
    FreshBite.showToast(`${planName} plan selected! Proceeding to account...`);
    setTimeout(()=>{ window.location.href = 'account.html'; }, 900);
  }

  function initializeFAQ(){
    document.querySelectorAll('.faq-item').forEach(item=>{
      item.addEventListener('click', ()=> item.classList.toggle('active'));
    });
  }

  // Optional: feature compare helper (no :contains/:has)
  function compareFeatures(featureText){
    document.querySelectorAll('.comparison-table tbody tr').forEach(tr=>{
      const first = tr.querySelector('td');
      if(first && first.textContent.trim().toLowerCase() === String(featureText).toLowerCase()){
        tr.style.background = '#fff5f1';
      }
    });
  }

  // Recommendation (guarded)
  function getRecommendedPlan(p){
    const meals = +p.meals || 0; const budget = +p.budget || 0; const lifestyle = p.lifestyle||'';
    if(meals>6 || (budget>140 && lifestyle==='busy')) return 'elite';
    if(meals>3 || (budget>90 && lifestyle==='active')) return 'premium';
    return 'casual';
  }
  window.FreshBite_Subscribe = { compareFeatures, getRecommendedPlan };
})();

