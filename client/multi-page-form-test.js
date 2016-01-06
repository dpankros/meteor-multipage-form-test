Meteor.startup(function() {
    AutoForm.debug();
  }
)


//note that this var is created in the page scope so it is not visible to other
//pages as written
var createAccountMP = new MultiPageForm({
    //sets the first page that is shown
    defaultPage: 'firstPage',

    //definition for the first page
    firstPage: {
      template: 'firstForm', //blaze template name
      form: 'firstFormId', //autoform id
      next: function(doc, mp) { //next function that returns the name of the next page
        var nextPage = 'lastPage';
        if (doc.firstPage) {
          switch (doc.firstPage.accountType) {
            case 'first':
              nextPage = 'secondAPage';
              break;
            case 'second':
              nextPage = 'secondBPage';
              break;
          }
        }
        return nextPage;
      },
      check: firstFormSchema //optional - a schema to check upon submit
    },

    secondAPage: {
      template: 'form1a',
      form: 'form1aId',
      next: 'lastPage', //notice you don't have to specify a function; it can also be a string
      check: form2aSchema
    },

    secondBPage: {
      template: 'form1b',
      form: 'form1bId',
      next: 'lastPage',
      check: form2bSchema
    },

    lastPage: {
      template: 'lastForm',
      form: 'lastFormId',
      check: lastFormSchema
    }
  },
  { //document, just omit it if you want to start with a blank form
    firstPage: {
      first: 'Some Default Value, if you want one'
    }
  }
);
createAccountMP.addHooks({
    onSubmit: onFormSubmit, //when the last form submits
    onComplete: onCreateAccount, //if the last form submit doesn't error out
    onError: onError,
    onNext: logOnly, //just so you can see the events fire
    onPrev: logOnly //just so you can see the events fire
    //saveDocument: function()...  saves the document after each page submits.
    //only override saveDocument if you don't like the format of the document with
    //a property for each page
  }
);


function onCreateAccount(page, doc, mp) {
  console.log('onCreateAccount', page, doc);
  //Account created, probably give some notice

  //AlertCategory.getOrCreate('mpf').clearAll();
  AlertCategory.getOrCreate('mpf').show('success', 'Form Submitted Successfully', undefined, 20*1000);
}


function onFormSubmit(page, doc, mp) {
  console.log('onFormSubmit', page, doc);

  if (!doc.lastPage) {
    throw new Meteor.Error('Invalid Data', 'doc does not contain a property named lastPage');
  }

  var that = this;
  if (doc.lastPage.server) {
    if (doc.lastPage.fail) {
      Meteor.call('fail', function(e, r) {
          if (e) {
            console.error(e.message);
            that.done(e);
            return;
          }
          console.log(r);
          that.done();
        }
      )
    } else {
      Meteor.call('succeed', function(e, r) {
          if (e) {
            console.error(e.message);
            that.done(e);
            return;
          }
          console.log(r);
          that.done();
        }
      )
    }
  } else {
    //local
    if (doc.lastPage.fail) {
      this.done('Manually triggered error');
    }
  }
}


function onError(page, doc, mp, e) {
  console.log('onError', e, page, doc);

  const TIMEOUT = 20*1000; //10 seconds in ms
  AlertCategory.getOrCreate('mpf').show('danger', e, undefined, TIMEOUT);
}

function logOnly(page, doc, mp) {
  console.log('Prev/Next action', page, doc);
}


Template.mpf.helpers({
    multipage: function() {
      return createAccountMP;
    }
  }
);

Template.firstForm.helpers({
    doc: function() {
      return createAccountMP.doc;
    },
    schema: function() {
      return firstFormSchema;
    }
  }
);

Template.form1a.helpers({
    doc: function() {
      return createAccountMP.doc;
    },
    schema: function() {
      return form2aSchema;
    }
  }
);

Template.form1b.helpers({
    doc: function() {
      return createAccountMP.doc;
    },
    schema: function() {
      return form2bSchema;
    }
  }
);

Template.lastForm.helpers({
    doc: function() {
      return createAccountMP.doc;
    },
    schema: function() {
      return lastFormSchema;
    }
  }
);


