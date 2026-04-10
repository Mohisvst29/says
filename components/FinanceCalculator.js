'use client';

import { useState } from 'react';

export default function FinanceCalculator({ isEnglish }) {
  const [price, setPrice] = useState('');
  const [downpayment, setDownpayment] = useState('');
  const [term, setTerm] = useState(60); // months
  const [rate, setRate] = useState(5.5); // percentage
  
  const calculateInstallment = () => {
    const P = Number(price) - Number(downpayment);
    if (P <= 0) return 0;
    
    // r = monthly interest rate
    const r = (Number(rate) / 100) / 12;
    const n = Number(term);
    
    if (r === 0) return P / n;
    
    const installment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.max(0, installment);
  };
  
  const monthly = calculateInstallment();

  return (
    <div className="finance-calculator-container" style={{
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid var(--color-border)',
      marginTop: '32px'
    }}>
      <h3 style={{ marginBottom: '20px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fas fa-calculator"></i>
        {isEnglish ? 'Finance Calculator' : 'حاسبة التمويل'}
      </h3>
      
      <div className="calculator-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div className="calc-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            {isEnglish ? 'Vehicle Price (SAR)' : 'سعر السيارة (ريال)'}
          </label>
          <input 
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
            placeholder={isEnglish ? 'e.g. 150000' : 'مثال 150000'}
          />
        </div>
        <div className="calc-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            {isEnglish ? 'Down Payment (SAR)' : 'الدفعة الأولى (ريال)'}
          </label>
          <input 
            type="number" 
            value={downpayment}
            onChange={(e) => setDownpayment(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
            placeholder={isEnglish ? 'e.g. 30000' : 'مثال 30000'}
          />
        </div>
        <div className="calc-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            {isEnglish ? 'Loan Term (Months)' : 'مدة التمويل (أشهر)'}
          </label>
          <select 
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
          >
            <option value={12}>12 {isEnglish ? 'Months' : 'شهراً'}</option>
            <option value={24}>24 {isEnglish ? 'Months' : 'شهراً'}</option>
            <option value={36}>36 {isEnglish ? 'Months' : 'شهراً'}</option>
            <option value={48}>48 {isEnglish ? 'Months' : 'شهراً'}</option>
            <option value={60}>60 {isEnglish ? 'Months' : 'شهراً'}</option>
          </select>
        </div>
        <div className="calc-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            {isEnglish ? 'Interest Rate (%)' : 'نسبة المرابحة (%)'}
          </label>
          <input 
            type="number" 
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
          />
        </div>
      </div>
      
      <div className="calc-result" style={{
        marginTop: '24px',
        padding: '24px',
        background: 'var(--gradient-gold)',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#000'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'rgba(0,0,0,0.7)', marginBottom: '8px' }}>
          {isEnglish ? 'Estimated Monthly Payment' : 'القسط الشهري المتوقع'}
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(monthly)}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)', marginTop: '8px' }}>
          {isEnglish ? '* Subject to bank approval and terms.' : '* هذه الحاسبة تقديرية وتخضع لشروط وأحكام جهات التمويل.'}
        </div>
      </div>
    </div>
  );
}
