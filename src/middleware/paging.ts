import { ParameterizedContext } from 'koa';
interface IBody {
  payload: any;
}
export async function Paging(ctx: ParameterizedContext, next: Function) {
  const { limit, cursor, sort, assigned } = ctx.request.query;

  ctx._pagingRequest = {
    assigned: assigned as string,
    cursor: cursor as string,
    limit: limit as string,
    sort: sort as string,
  };

  await next();
  const { payload } = ctx.body as IBody;
  const hasMore = payload.length === parseInt(ctx._pagingRequest.limit) + 1;

  let nextCursor: any;

  if (hasMore) {
    nextCursor = Math.floor(payload[parseInt(ctx._pagingRequest.limit) - 1].createdAt.getTime() / 1000);
    payload.pop();
  }
  ctx.body = {
    payload,
    paging: {
      hasMore,
      nextCursor,
    },
  };
}
