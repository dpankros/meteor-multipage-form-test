firstFormSchema = new SimpleSchema({
  first: {
    type: String,
    label: 'First Input',
    optional: true
  },
  accountType: {
    type: String,
    label: 'Account Type',
    allowedValues: ['basic', 'first', 'second'],
    autoform: {
      options: {
        basic: "Basic (goes straight to last page)",
        first: "First Tier (goes to tier 1 input page)",
        second: "Second Tier (goes to tier 2 input page)"
      }
    }
  }
});

form2aSchema = new SimpleSchema({
  something: {
    type: String,
    label: 'Tier 1 Input',
    optional: true
  }
});

form2bSchema = new SimpleSchema({
  somethingElse: {
    type: String,
    label: 'Tier 2Input',
    optional: true
  }
});

lastFormSchema = new SimpleSchema({
  accept: {
    type: Boolean,
    label: 'I accept the terms of service',
    optional: false,
    custom: function() {
      if (! this.value) return 'accept';
    }
  },
  fail: {
    type: Boolean,
    label: 'Trigger Error on Submit (for testing)',
    optional: true
  }
});

