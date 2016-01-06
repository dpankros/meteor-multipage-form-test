Meteor.methods({
  succeed: function(){
    return true;
  },
  fail: function() {
    throw new Meteor.Error('Server Method Failed', 'Manually triggered server failure')
  }
})