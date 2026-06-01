import { connect } from 'react-redux';
import {
  sendExtractionRuleSqlQuery
} from 'store/extractionRulesReducer';
import {
  loadConnection,
} from 'store/connectionsReducer';

const mapStateToProps = (state) => {
  return {
    extractionRules: state.extractionRules,
  };
};

const mapDispatchToProps = {
  sendExtractionRuleSqlQuery: (id, query) => sendExtractionRuleSqlQuery(id, query),
  loadConnection: (id) => loadConnection(id),
};

export const connector = (component) => connect(
  mapStateToProps,
  mapDispatchToProps
)(component);

export default { connector };

