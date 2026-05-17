import React, { PropsWithChildren } from 'react';
import { asyncStoragePersister, queryClient } from './';
import { NON_PERSISTED_CACHE_KEYS } from './cache';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

/**
 * 缓存上下文
 */
export const CacheProvider: React.FC<PropsWithChildren> = React.memo(
  (props) => {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              const [cacheKey] = query.queryKey;
              return !NON_PERSISTED_CACHE_KEYS.includes(cacheKey as any);
            },
          },
        }}
      >
        {props.children}
      </PersistQueryClientProvider>
    );
  }
);
CacheProvider.displayName = 'CacheProvider';
