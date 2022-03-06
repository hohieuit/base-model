import { ListProps, FindProps, CountProps } from '../model/Query';
import { Paging } from '../model/Paging';

export interface IBaseController<T> {
  get(id: string): Promise<T | undefined>;
  upsert(t: Partial<T>): Promise<T>;
  bulkUpsert(props: { list: T[] }): Promise<T[]>;
  delete(id: string): Promise<T | undefined>;
  list(props: ListProps<T>): Promise<Paging<T>>;
  find(props: FindProps<T>): Promise<T[]>;
  count(props: CountProps<T>): Promise<number>;
}
