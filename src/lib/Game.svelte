<script lang="ts">
  import { getContext, onMount } from "svelte";
  import NumberContainer from "./NumberContainer.svelte";
  import type { Writable } from "svelte/store";
  import { XORShift } from "random-seedable";

  export let seeded: boolean = false;
  export let currentDay: number = 0;

  let input: string = "";
  let operation: string = "+";
  let num1: number = 0;
  let num2: number = 0;
  let startTime: number = Date.now();
  let endTime: number;
  let timeRemaining: string;
  let rand = new XORShift(seeded ? parseInt(new Date().toDateString(), 36) : undefined);

  let hasStarted: Writable<boolean> = getContext('hasStarted');
  let score: Writable<number> = getContext('score');
  let dailyScore: Writable<number> = getContext('dailyScore');
  let lastDaily: Writable<number> = getContext('lastDaily');
  let livedFor: Writable<number> = getContext('livedFor');

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

    input = "";

    if (!dontIncrement) {
      score.update((n) => n + 1);
      endTime += 200 / (endTime - startTime) * 1000000;
    };
  }

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
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
    findRemainingTime();
  });
</script>

<h2 class="flex"><code>{timeRemaining}</code></h2>
<div class="flex gap-4 items-center">
  <NumberContainer>{num1}</NumberContainer>
  <div class="text-2xl">{operation}</div>
  <NumberContainer>{num2}</NumberContainer>
  <div class="text-2xl">=</div>
  <input autofocus class="counter w-[55px] text-center" maxlength=3 bind:value={input} on:input={handleInput}/>
</div>