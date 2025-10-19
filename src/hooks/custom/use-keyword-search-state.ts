import { parseAsString, SingleParserBuilder, useQueryStates, UseQueryStatesOptions, Values } from 'nuqs';

type KeywordSearchStateMap = {
  keyword: SingleParserBuilder<string>;
  keywordName: SingleParserBuilder<string>;
};

export type KeywordSearchState = Values<{
  keyword: SingleParserBuilder<string>;
  keywordName: SingleParserBuilder<string>;
}>;

export function useKeywordSearchState(option?: Partial<UseQueryStatesOptions<KeywordSearchStateMap>>) {
  const [keywordOptions, setKeywordOptions] = useQueryStates(
    { keyword: parseAsString, keywordName: parseAsString },
    option,
  );

  const reset = () => {
    setKeywordOptions({ keyword: '', keywordName: '' });
  };

  return { keywordOptions, setKeywordOptions, reset };
}
