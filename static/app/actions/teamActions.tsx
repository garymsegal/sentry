import Reflux from 'reflux';

const TeamActions = Reflux.createActions([
  'createTeam',
  'createTeamError',
  'createTeamSuccess',
  'fetchAll',
  'fetchAllError',
  'fetchAllSuccess',
  'fetchDetails',
  'fetchDetailsError',
  'fetchDetailsSuccess',
  'loadTeams',
  'loadUserTeams',
  'removeTeam',
  'removeTeamError',
  'removeTeamSuccess',
  'update',
  'updateError',
  'updateSuccess',
]);

export default TeamActions;
