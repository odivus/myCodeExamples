import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../Store/Hooks';
import {MINIMAL_SEARCH_QUERY_LENGTH, searchDebounceTimeout} from '../../Consts';
import debounce from 'lodash/debounce';
import {ISuggestOption} from '@dbo-features/system/components/Suggest/types';
import {Suggest} from '@dbo-features/system/components/Suggest/Suggest';
import {i18n} from '../../i18n/config';
import {EProcessStatus} from '../../Common/Enums';
import {PartnerAtfOperator} from '../../../../generated/atf-api/model/partnerAtfOperator';
import {fetchByAtf, IFilterAtf} from 'PartnerForm/Store/Slices/OperatorAtf';
import {getDefaultPagination} from 'PartnerForm/Utils';

interface IProps {
  onSelect: (value: PartnerAtfOperator | null) => void;
  value?: PartnerAtfOperator | null;
}

/** 
 * Пример на основе реального компонента приложения банка.
 * Suggest options 
*/
function getOptions(atfOperators: PartnerAtfOperator[]): ISuggestOption[] {
  if (!atfOperators) {
    return [];
  }
  return atfOperators.map((result: PartnerAtfOperator) => {
    return {label: result?.name ?? '', value: result};
  });
}

export const SuggestAtf: React.FC<IProps> = (props: IProps) => {
  const [valueInner, setValueInner] = useState('');
  const dispatch = useAppDispatch();
  const {innerValue, disableAllField} = useAppSelector((state) => state);

  const operatorData = useAppSelector((state) => state.operatorsATF.operatorOptions?.operators);
  const operatorDataStatus = useAppSelector((state) => state.operatorsATF.statusLoadOperator);
  
  const controllerAbort = useRef<AbortController | null>(null);

  const fetchOperatorsAtf = (operator = '') => {
    controllerAbort.current?.abort();
    controllerAbort.current = new AbortController();
    const params: IFilterAtf = {
      filter: {
        search: operator,
        inn: innerValue.inn,
        kpp: innerValue.kpp,
        pagination: getDefaultPagination(),
      },
      xhrOptions: {signal: controllerAbort.current.signal},
    };
    dispatch(fetchByAtf(params));
  };

  useEffect(() => {
    if (props.value !== undefined) {
      setValueInner(props.value?.name ?? '');
    }
  }, [props.value]);

  /**
   * Search Delay Handler
   */
  const debounceSearchOperator = useMemo(() => {
    return debounce((operator: string) => {
      if (operator?.length >= MINIMAL_SEARCH_QUERY_LENGTH) {
        fetchOperatorsAtf(operator);
      }
    }, searchDebounceTimeout);
  }, [fetchByAtf, innerValue]);

  /**
  * Handler for receiving EDM operators when clicking on the EDM Operators field.
  */
  const handleFocus = () => {
    if (operatorDataStatus === EProcessStatus.IDLE || operatorData?.length === 0) {
      fetchOperatorsAtf();
    }
  };

  const handleFilter = (value) => {
    controllerAbort.current?.abort();
    debounceSearchOperator(value);
    
    props.onSelect?.({name: value});
    if (value === '') {
      props.onSelect?.(undefined);
      fetchOperatorsAtf();
    }
    setValueInner(value);
  };

  const handleSelect = (value) => {
    if (!value?.value?.name) {
      setValueInner(value?.name ?? '');
      props.onSelect?.(null);
    } else {
      props.onSelect?.(value.value);
    }
  };

  return (
    <Suggest
      value={valueInner !== '' ? {label: valueInner} : undefined}
      options={getOptions(operatorData)}
      placeholder={i18n.t('Atf.Placeholder')}
      tooltipHint={i18n.t('Notification.nothingFound')}
      onFilter={handleFilter}
      onSelect={handleSelect}
      onFocus={handleFocus}
      disabled={disableAllField}
      loading={operatorDataStatus === EProcessStatus.RUNNING}
      isTooltipOpened={
        operatorData?.length === 0 &&
        ![EProcessStatus.RUNNING, EProcessStatus.IDLE].includes(operatorDataStatus)
      }
      saveFilterOnFocus={true}
    />
  );
};
