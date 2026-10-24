// 这些片段供 React 19+ 项目使用；当前站点依赖 React 18，不会执行它们。
export const react19Files = [
  {
    name: 'useActionState.jsx',
    code: `import { useActionState } from 'react';

async function saveName(previousMessage, formData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) return '请输入姓名';
  await new Promise(resolve => setTimeout(resolve, 600));
  return '已保存：' + name;
}

export default function ProfileForm() {
  const [message, submitAction, isPending] = useActionState(saveName, '');
  return (
    <form action={submitAction}>
      <input name="name" placeholder="姓名" />
      <button disabled={isPending}>{isPending ? '保存中…' : '保存'}</button>
      <p>{message}</p>
    </form>
  );
}`,
  },
  {
    name: 'useOptimistic.jsx',
    code: `import { startTransition, useOptimistic, useState } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes, (current, delta) => current + delta
  );

  function like() {
    startTransition(async () => {
      addOptimisticLike(1); // 请求未结束，先显示 +1
      await new Promise(resolve => setTimeout(resolve, 600));
      setLikes(current => current + 1); // 用真实结果更新基础状态
    });
  }

  return <button onClick={like}>点赞 {optimisticLikes}</button>;
}`,
  },
  {
    name: 'useFormStatus.jsx',
    code: `import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>
    {pending ? '提交中…' : '提交'}
  </button>;
}

export default function FeedbackForm() {
  async function submit(formData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log(formData.get('feedback'));
  }
  return <form action={submit}>
    <input name="feedback" />
    <SubmitButton />
  </form>;
}`,
  },
  {
    name: 'useEffectEvent.jsx',
    code: `// React 19.2+
import { useEffect, useEffectEvent, useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const onTick = useEffectEvent(() => {
    setCount(count + step); // 每次都读取最新的 count 和 step
  });

  useEffect(() => {
    const timer = setInterval(() => onTick(), 1000);
    return () => clearInterval(timer);
  }, []); // step 变化不需要重建计时器

  return <>
    <p>计数：{count}</p>
    <button onClick={() => setStep(value => value + 1)}>步长：{step}</button>
  </>;
}`,
  },
  {
    name: 'use-api.jsx',
    code: `// use 是 React 19 API，不是普通 Hook。
import { Suspense, use } from 'react';

const greetingPromise = new Promise(resolve => {
  setTimeout(() => resolve('欢迎回来'), 600);
}); // 稳定的 Promise，不要在每次渲染时重新创建

function Greeting() {
  const text = use(greetingPromise);
  return <p>{text}</p>;
}

export default function App() {
  return <Suspense fallback={<p>加载中…</p>}>
    <Greeting />
  </Suspense>;
}`,
  },
]
