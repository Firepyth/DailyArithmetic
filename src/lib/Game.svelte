<script lang="ts">
  import { getContext, onMount } from "svelte";
  import NumberContainer from "./components/NumberContainer.svelte";
  import { writable, type Writable } from "svelte/store";
  import { XORShift } from "random-seedable";
  import Input from "./components/Input.svelte";
  import Code from "./components/Code.svelte";
  import { tweened } from "svelte/motion";
  import * as Ease from "svelte/easing";

  export let seeded: boolean = false;
  export let currentDay: number = 0;

  let input: Writable<string> = writable('');
  let operation: string = '+';
  let num1: number = 0;
  let num2: number = 0;
  let startTime: number = Date.now();
  let endTime: number;
  let endTimeFixed: number;
  let timeRemaining: string;
  let rand = new XORShift(seeded ? parseInt(new Date().toDateString(), 36) : undefined);
  let timeSaved: string = '';
  let oldInput = '';


  const options = {
    duration: 3000, // Time in ms or (from, to) => time in ms
    easing: Ease.sineOut, // Linear easing
    interpolate: (from: number, to: number) => (t: number) =>
      from + (to - from) * t,
  };

  const tween = tweened(1, options);

  const fadeOut = async () => {
    await tween.set(1, { duration: 0 });
    tween.set(0);
  }

  let hasStarted: Writable<boolean> = getContext('hasStarted');
  let score: Writable<number> = getContext('score');
  let dailyScore: Writable<number> = getContext('dailyScore');
  let lastDaily: Writable<number> = getContext('lastDaily');
  let livedFor: Writable<number> = getContext('livedFor');
  let isOnHard: Writable<boolean> = getContext('isOnHard');

  const flipNums = () => {
    const temp = num2;
    num2 = num1;
    num1 = temp;
  }

  const randomizeNumbers = (dontIncrement?: boolean) => {
    const operations = ["+", "-", "×", "/"];
    const operationIndex = Math.floor(rand.float() * 4);
    operation = operations[operationIndex];

    switch (operation) {
      case "+":
        num1 = Math.ceil(rand.float() * 100);
        num2 = Math.ceil(rand.float() * 100);
        break;
      case "-":
        num1 = Math.ceil(rand.float() * 100);
        num2 = Math.ceil(rand.float() * 100);
        if (num1 < num2) {
          flipNums();
        }
        break;
      case "×":
        num1 = Math.ceil(rand.float() * 25);
        num2 = Math.ceil(rand.float() * 25);
        break;
      case "/":
        num2 = Math.ceil(rand.float() * 25);
        num1 = num2 * Math.ceil(rand.float() * 25);
        break;
    }

    oldInput = '';
    input.set('');

    if (!dontIncrement) {
      score.update((n) => n + 1);
      let timeSavedMilliseconds = 200 / (endTimeFixed - startTime) * 1000000;
      timeSaved = `+${(timeSavedMilliseconds / 1000).toFixed(2)}`;
      endTime += timeSavedMilliseconds;
      endTimeFixed += timeSavedMilliseconds;

      fadeOut();
    };
  }

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if ($isOnHard && target.value.length < oldInput.length) {
      const diff = oldInput.length - target.value.length;
      timeSaved = `-${diff}.00`;
      endTime -= 1000 * diff;

      fadeOut();
    }

    oldInput = target.value;

    switch (operation) {
      case "+":
        if (parseInt(target.value) === num1 + num2) {
          randomizeNumbers();
        } 
        break;
      case "-":
        if (parseInt(target.value) === num1 - num2) {
          randomizeNumbers();
        } 
        break;
      case "×":
        if (parseInt(target.value) === num1 * num2) {
          randomizeNumbers();
        } 
        break;
      case "/":
        if (parseInt(target.value) === num1 / num2) {
          randomizeNumbers();
        } 
        break;
    }
  }

  const handleEnd = () => {
    hasStarted.set(false);
    if (seeded) {
      localStorage.setItem('dailyScore', $score.toString());
      localStorage.setItem('lastDaily', currentDay.toString());
      localStorage.setItem('livedFor', (endTime - startTime).toString());
      dailyScore.set($score);
      lastDaily.set(currentDay);
      livedFor.set((endTime - startTime) / 1000);
    }
  }

  const findRemainingTime = () => {
    if (endTime - Date.now() < 0) {
      return handleEnd();
    }
    timeRemaining = (Math.ceil((endTime - Date.now()) / 10) / 100).toFixed(2);

    requestAnimationFrame(findRemainingTime);
  }
  
  onMount(() => {
    randomizeNumbers(true);

    score.set(0);
    endTime = Date.now() + 30000;
    endTimeFixed = endTime;
    findRemainingTime();
  });
</script>

<div class="relative">
  {#if timeSaved !== ""}
    <code class="popup absolute left-0 right-0 top-[-1.5rem] text-[.75rem]" style:--opacity={`${$tween}`}>
      {timeSaved}s
    </code>
  {/if}
  <p class="flex"><Code>{timeRemaining}s</Code></p>
</div>
<div class="flex gap-4 items-center">
  <NumberContainer>{num1}</NumberContainer>
  <div class="text-2xl">{operation}</div>
  <NumberContainer>{num2}</NumberContainer>
  <div class="text-2xl">=</div>
  <Input input={input} handleInput={handleInput}/>
</div>

<style>
  .popup {
    opacity: var(--opacity);
  }
</style>