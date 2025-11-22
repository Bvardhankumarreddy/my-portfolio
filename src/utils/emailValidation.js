// Email validation and verification service
import axios from 'axios';

/**
 * Validate email format
 */
export const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Check for disposable/temporary email domains
 */
const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', 'throwaway.email',
    '10minutemail.com', 'trashmail.com', 'temp-mail.org', 'fakeinbox.com',
    'maildrop.cc', 'sharklasers.com', 'yopmail.com'
];

export const isDisposableEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
};

/**
 * Validate email domain has valid MX records
 */
export const validateEmailDomain = async (email) => {
    try {
        const domain = email.split('@')[1];
        if (!domain) return { valid: false, reason: 'Invalid email format' };
        
        // Check common typos in popular domains
        const commonTypos = {
            'gmial.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'gamil.com': 'gmail.com',
            'gmil.com': 'gmail.com',
            'yaho.com': 'yahoo.com',
            'yahooo.com': 'yahoo.com',
            'hotmial.com': 'hotmail.com',
            'outlok.com': 'outlook.com'
        };
        
        if (commonTypos[domain.toLowerCase()]) {
            return {
                valid: false,
                reason: `Did you mean ${commonTypos[domain.toLowerCase()]}?`,
                suggestion: email.replace(domain, commonTypos[domain.toLowerCase()])
            };
        }
        
        // Basic domain validation
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(domain)) {
            return { valid: false, reason: 'Invalid domain format' };
        }
        
        return { valid: true };
    } catch (error) {
        console.error('Domain validation error:', error);
        return { valid: true }; // Allow if validation fails
    }
};

/**
 * Comprehensive email validation before sending
 */
export const validateEmailBeforeSending = async (email) => {
    // 1. Check format
    if (!validateEmailFormat(email)) {
        return {
            valid: false,
            error: 'Please enter a valid email address'
        };
    }
    
    // 2. Check for disposable emails
    if (isDisposableEmail(email)) {
        return {
            valid: false,
            error: 'Temporary email addresses are not allowed. Please use a permanent email address.'
        };
    }
    
    // 3. Check domain
    const domainCheck = await validateEmailDomain(email);
    if (!domainCheck.valid) {
        return {
            valid: false,
            error: domainCheck.reason,
            suggestion: domainCheck.suggestion
        };
    }
    
    // 4. Check against bounce list
    const isBounced = await isEmailBounced(email);
    if (isBounced) {
        return {
            valid: false,
            error: 'This email address has previously bounced. Please verify the email address is correct.'
        };
    }
    
    return { valid: true };
};

/**
 * Check if email is in bounce list (localStorage)
 */
export const isEmailBounced = async (email) => {
    try {
        const bounceList = JSON.parse(localStorage.getItem('email_bounces') || '[]');
        return bounceList.some(bounce => 
            bounce.email.toLowerCase() === email.toLowerCase() &&
            Date.now() - bounce.timestamp < 30 * 24 * 60 * 60 * 1000 // 30 days
        );
    } catch (error) {
        return false;
    }
};

/**
 * Add email to bounce list
 */
export const addToBounceList = (email, reason = 'Bounced') => {
    try {
        const bounceList = JSON.parse(localStorage.getItem('email_bounces') || '[]');
        bounceList.push({
            email: email.toLowerCase(),
            reason,
            timestamp: Date.now()
        });
        localStorage.setItem('email_bounces', JSON.stringify(bounceList));
    } catch (error) {
        console.error('Error adding to bounce list:', error);
    }
};

/**
 * Remove email from bounce list (manual cleanup)
 */
export const removeFromBounceList = (email) => {
    try {
        const bounceList = JSON.parse(localStorage.getItem('email_bounces') || '[]');
        const filtered = bounceList.filter(bounce => 
            bounce.email.toLowerCase() !== email.toLowerCase()
        );
        localStorage.setItem('email_bounces', JSON.stringify(filtered));
    } catch (error) {
        console.error('Error removing from bounce list:', error);
    }
};

/**
 * Clean up old bounce records (older than 30 days)
 */
export const cleanupBounceList = () => {
    try {
        const bounceList = JSON.parse(localStorage.getItem('email_bounces') || '[]');
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const cleaned = bounceList.filter(bounce => bounce.timestamp > thirtyDaysAgo);
        localStorage.setItem('email_bounces', JSON.stringify(cleaned));
    } catch (error) {
        console.error('Error cleaning bounce list:', error);
    }
};
