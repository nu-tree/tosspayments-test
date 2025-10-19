import { extendTailwindMerge } from 'tailwind-merge';
// Info: tailwind-merge 확장
export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [],
        },
      ],
    },
  },
});
