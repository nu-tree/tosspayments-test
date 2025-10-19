// 'use client';

// // import { useSiteTermsByKey } from '@/hooks/pages/site-terms-setting/use-site-terms-by-key';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { AlertCircle } from 'lucide-react';
// import { TiptapViewer } from '@/components/custom-ui/tiptap/core';

// type TermsViewerProps = {
//   termKey: string;
//   title: string;
// };

// /**
//  * 약관 내용 뷰어 컴포넌트
//  */
// export const TermsViewer = ({ termKey, title }: TermsViewerProps) => {
//   // const { data: terms, isLoading, error } = useSiteTermsByKey(termKey);

//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-8 w-64" />
//         <Skeleton className="h-4 w-full" />
//         <Skeleton className="h-4 w-full" />
//         <Skeleton className="h-4 w-3/4" />
//       </div>
//     );
//   }

//   if (error || !terms) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>
//           {error instanceof Error ? error.message : '약관을 불러올 수 없습니다.'}
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* 헤더 */}
//       <div className="border-b pb-4">
//         <h1 className="text-3xl font-bold">{terms.name || title}</h1>
//         <p className="text-muted-foreground mt-2 text-sm">
//           최종 수정일: {new Date(terms.createdAt).toLocaleDateString('ko-KR')}
//         </p>
//       </div>

//       {/* 약관 내용 */}
//       <TiptapViewer keyId={terms.key} content={terms.value} />
//     </div>
//   );
// };
