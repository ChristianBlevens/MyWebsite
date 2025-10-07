/**
 * FORM COMPONENTS
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('contactForm', () => ({
    // Form State
    formData: {
      name: '',
      email: '',
      message: ''
    },
    formSubmitted: false,
    submitting: false,
    errorMessage: null,

    init() {
      this.initializeEmailJS();
    },

    // Initialize EmailJS service
    initializeEmailJS() {
      if (window.emailjs && !window.emailjsInitialized) {
        emailjs.init(window.config.emailjs.publicKey);
        window.emailjsInitialized = true;
      }
    },

    // Handle form submission
    async handleSubmit() {
      this.submitting = true;
      this.errorMessage = null;

      try {
        this.validateForm();
        await this.sendEmail();
        this.resetForm();
      } catch (error) {
        this.handleSubmissionError(error);
      } finally {
        this.submitting = false;
      }
    },

    // Validate form data
    validateForm() {
      if (!this.formData.name || !this.formData.email || !this.formData.message) {
        throw new Error("Please fill out all fields");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        throw new Error("Please enter a valid email address");
      }
    },

    // Send email via EmailJS
    async sendEmail() {
      const templateParams = {
        from_name: this.formData.name,
        reply_to: this.formData.email,
        message: this.formData.message,
        to_email: 'christianblevensroot@gmail.com'
      };

      await emailjs.send(
        window.config.emailjs.serviceId,
        window.config.emailjs.templateId,
        templateParams
      );
    },

    // Handle submission errors
    handleSubmissionError(error) {
      console.error("Form submission error:", error);
      this.errorMessage = error.message || 'There was an error submitting the form. Please try again.';
    },

    // Reset form after successful submission
    resetForm() {
      this.formData = { name: '', email: '', message: '' };
      this.formSubmitted = true;

      setTimeout(() => {
        this.formSubmitted = false;
      }, 5000);
    },

    // Handle keyboard shortcuts
    handleKeydown(event) {
      if (event.key === 'Enter' && event.target.tagName.toLowerCase() !== 'textarea') {
        event.preventDefault();
        this.handleSubmit();
      }
    }
  }));
});
