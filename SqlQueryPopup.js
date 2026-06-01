import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import HsFlatButton from 'components/HsFlatButton';
import { HsMuiDialog } from 'widgets/HsMuiDialog/HsMuiDialog';
import { HsMuiTextField } from 'widgets/HsMuiTextField/HsMuiTextField';
import { getQuery } from 'components/SettingsTabMenu/tabs/ConnectRulesTab/DbConnectRuleForm/DbConnectRuleFormHelpers.js';
import { connector } from './SqlQueryPopupConnector';

class SqlQueryPopup extends Component {
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  static propTypes = {
    extractionRules: PropTypes.object,
    ruleId: PropTypes.number,
    connectId: PropTypes.number,
    title: PropTypes.string,
    query: PropTypes.string,
    isFirstOpen: PropTypes.bool,
    open: PropTypes.bool,
    onCancel: PropTypes.func,
    onAccept: PropTypes.func,
    setQuery: PropTypes.func,
    setIsFirstOpen: PropTypes.func,
    sendExtractionRuleSqlQuery: PropTypes.func,
    setIsShowDbDataPreview: PropTypes.func,
  };

  static defaultProps = {
    title: 'Текст запроса'
  };

  constructor(props) {
    super(props);
  }

  getStyles() {
    const { palette } = this.context.muiTheme;
    const disabledColor = palette.disabledColor;

    return {
      dialog: {
        maxWidth: '760px',
        minWidth: '550px'
      },
      dialogTitle: {
        padding: '24px 24px 0 24px'
      },
      dialogBody: {
        fontSize: '13px',
        overflowY: 'visible',
        minHeight: '400px'
      },
      dialogContent: {
        margin: '20px 0'
      },
      button: {
        margin: 0,
        padding: 0,
        width: '136px' },
      buttonCancel: {
        margin: '0 12px 0 0',
        padding: 0,
        width: '136px'
      },
      scheduleInfo: {
        color: palette.primary1Color,
      },
      field: { height: 'initial', width: '100%', minHeight: 20, fontSize: '', lineHeight: '', cursor: 'edit' },
      fieldSQL: {
        width: '100%',
        height: 'initial',
        fontSize: '',
        lineHeight: '',
        backgroundColor: palette.canvasColor,
        border: `solid 1px ${palette.borderColor}`,
        borderRadius: '5px',
      },
      fieldInput: { minHeight: 'inherit', marginTop: '', padding: 0 },
      fieldTextarea: { lineHeight: '16px', height: 'inherit', marginTop: '', marginBottom: 0, padding: 4 },
      fieldUnderline: { bottom: 0 },
      fieldNoUnderline: { bottom: 0, borderColor: 'transparent' },
      fieldHint: { bottom: '', top: 0, left: 0 },
    };
  }

  handleAccept() {
    const {
      query,
      ruleId,
      connectId,
      extractionRules,
      setQuery,
      setIsFirstOpen,
      setIsShowDbDataPreview,
      sendExtractionRuleSqlQuery,
    } = this.props;

    const querySaved = getQuery(ruleId, extractionRules);
    const queryFormatted = query.trim();

    if (!ruleId) {
      setIsFirstOpen(0);
      setIsShowDbDataPreview();
    }

    if (queryFormatted) {
      sendExtractionRuleSqlQuery(connectId, query);
    }

    setQuery(queryFormatted || querySaved);
  }

  handleCancel() {
    const {
      query,
      ruleId,
      extractionRules,
      setQuery,
      setIsFirstOpen,
    } = this.props;

    const querySaved = getQuery(ruleId, extractionRules);

    if (!ruleId && !query) {
      setIsFirstOpen(1);
    }

    if (_.isEmpty(query) && querySaved) {
      setQuery(querySaved);
    }
  }

  renderQuery() {
    const styles = this.getStyles();

    const {
      ruleId,
      extractionRules,
      query,
      isFirstOpen,
      setQuery,
    } = this.props;

    const querySaved = getQuery(ruleId, extractionRules);
    const value = isFirstOpen ? querySaved : query;

    return (
      <HsMuiTextField
        disabled={false}
        spellCheck='false'
        autoFocus
        fullWidth
        multiLine
        value={value}
        rows={15}
        rowsMax={15}
        id=''
        key=''
        hintText='Введите SQL-запрос набора данных'
        title='Редактировать SQL-запрос'
        style={styles.fieldSQL}
        textareaStyle={styles.fieldTextarea}
        hintStyle={styles.fieldHint}
        underlineStyle={styles.fieldNoUnderline}
        onChange={(e, v) => setQuery(v)}
      />
    );
  }

  render() {
    const {
      ruleId,
      extractionRules,
      title,
      open,
      query,
      onAccept,
      onCancel,
    } = this.props;

    let disabled = false;
    const querySaved = getQuery(ruleId, extractionRules);
    const styles = this.getStyles();

    if (!ruleId && !query) {
      disabled = true;
    }

    if (_.isEmpty(query) && !querySaved) {
      disabled = true;
    }

    return (
      <HsMuiDialog
        modal
        open={open}
        style={{ paddingTop: 45 }}
        className=''
        titleStyle={styles.dialogTitle}
        bodyStyle={styles.dialogBody}
        contentStyle={styles.dialog}
        title={title}
        actions={[
          <div>
            <HsFlatButton
              style={styles.buttonCancel}
              label='Отмена'
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
                this.handleCancel();
              }}
            />
            <HsFlatButton
              primary
              style={styles.button}
              label='Ок'
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
                this.handleAccept();
              }}
            />
          </div>
        ]}
      >
        <div style={styles.dialogContent}>
          {this.renderQuery()}
        </div>
      </HsMuiDialog>
    );
  }
}

export default connector(SqlQueryPopup);
