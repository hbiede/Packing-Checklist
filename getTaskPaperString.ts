export type Task = {
  name: string;
  subtasks?: [Task | string, ...(Task | string)[]];

  /**
   * @default true
   */
  autodone?: boolean;
  defer?: Date;
  done?: Date;
  due?: Date;
  flagged?: boolean;
  /**
   * @default true
   */
  parallel?: boolean;
  tags?: [string, ...string[]];
} & (
  | {
      repeatMethod: 'fixed' | 'start-after-completion' | 'due-after-completion';
      /**
       * ICS repeat rule (see {@link https://www.ietf.org/rfc/rfc2445.txt RCF244557})
       */
      repeatRule: string;
    }
  | {
      repeatMethod?: never;
      repeatRule?: never;
    }
);

const getMetadataString = ({
  autodone = true,
  defer,
  done,
  due,
  flagged,
  parallel = true,
  repeatMethod,
  repeatRule,
  tags,
}: Task) => {
  let result = [`@autodone(${autodone})`];

  if (defer) {
    result.push(`@defer(${defer.toISOString()})`);
  }
  if (done) {
    result.push(`@done(${done.toISOString()})`);
  }
  if (due) {
    result.push(`@due(${due.toISOString()})`);
  }

  if (flagged !== undefined) {
    result.push(`@flagged(${flagged})`);
  }

  if (parallel !== undefined) {
    result.push(`@parallel(${parallel})`);
  }

  if (repeatMethod) {
    result.push(`@repeat-method(${repeatMethod})`, `@repeat-rule${repeatRule}`);
  }

  if (tags && tags.length > 0) {
    result.push(`@tags(${tags.filter((tag) => !!tag).join(', ')})`);
  }

  return result.join(' ');
};

export const getTaskPaperString = (task: Task) => {
  const result: string[] = [];
  let indentLength = 0;
  let queue: (Task | string | null)[] = [task];

  while (queue.length > 0) {
    let current = queue[0];
    queue = queue.slice(1);

    if (current === null) {
      // null is a flag for the end of a list of subtasks
      indentLength--;
      continue;
    }

    if (typeof current === 'string') {
      result.push(`${'\t'.repeat(indentLength)}- ${current}`);
    } else {
      result.push(
        `${'\t'.repeat(indentLength)}- ${current.name} ${getMetadataString(
          current,
        )}`.trimRight(),
      );
      if (current.subtasks && current.subtasks.length > 0) {
        queue = [...current.subtasks, null, ...queue];
        indentLength++;
      }
    }
  }
  return result.join('\n');
};
