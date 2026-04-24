<script lang="ts">
  import { getContext, setContext } from "svelte";
  import Game from "./lib/Game.svelte";
  import { writable, type Writable } from "svelte/store";
  import Button from "./lib/components/Button.svelte";
  import Code from "./lib/components/Code.svelte";
  import Check from "./lib/components/Check.svelte";

  
  const currentDay = Math.floor(Date.now() / (1000 * 60 * 60 * 24) - new Date().getTimezoneOffset() / 60 / 24);
  let copyScoreMessage = "Copy Daily Score";
  
  setContext('hasStarted', writable(false));
  let hasStarted: Writable<boolean> = getContext('hasStarted');
    
  setContext('isOnHard', writable(localStorage.getItem('isOnHard') === "true"));
  let isOnHard: Writable<boolean> = getContext('isOnHard');

  setContext('score', writable(0));
  let score: Writable<number> = getContext('score');
  
  setContext('dailyScore', writable(parseInt(localStorage.getItem('dailyScore') ?? "-1")));
  let dailyScore: Writable<number> = getContext('dailyScore');
  
  setContext('lastDaily', writable(parseInt(localStorage.getItem('lastDaily') ?? "")));
  let lastDaily: Writable<number> = getContext('lastDaily');
  
  setContext('isDaily', writable(false));
  let isDaily: Writable<boolean> = getContext('isDaily');
  
  setContext('livedFor', writable(parseInt(localStorage.getItem('livedFor') ?? "") / 1000));
  let livedFor: Writable<number> = getContext('livedFor');

  const handleStart = (daily: boolean = false) => {
    isDaily.set(daily);
    hasStarted.set(true);
  }

  const handleCopyToClipboard = (e: Event) => {
    navigator.clipboard.writeText(`Daily Arithmetic ${currentDay - 20565}
Score: ${$dailyScore} - Survived for: ${$livedFor.toFixed(2)}s - Avg per problem: ${($livedFor / $dailyScore).toFixed(2)}s
https://firepyth.github.io/DailyArithmetic/`);
    copyScoreMessage =  "Copied!";
  }
</script>

<section class="flex flex-col gap-[1.5625rem] place-content-center place-items-center flex-1">
  {#if $hasStarted === false}
  <div>
    <h1 class="font-sans font-[500] text-text-h text-[2.25rem] my-[1.25rem]">Daily Arithmetic</h1>
    <p>Perform basic math operations as quickly as you can!</p>
    <p>Every problem you solve gives you a little more time, but with diminishing returns.</p>
    <p class="text-accent">Turn on hard mode for an extra challenge! Each incorrect number costs one second.</p>
  </div>
  <p class="flex gap-4">
    <Code>
      Daily Score: {currentDay === $lastDaily ? $dailyScore : "N/A"}
    </Code>
    <Code>
      Most Recent Score: {$score}
    </Code>
  </p>
  <div class="flex gap-4">
    <Button
      onClick={() => handleStart()}
    >
      Random  
    </Button>
    <Button
      onClick={() => handleStart(true)}
      disabled={currentDay === $lastDaily}
    >
      Daily
    </Button>
    <label for="hard-mode" class="flex items-center gap-2 text-accent font-mono pl-4">
      <Check {isOnHard}/>
      Hard Mode
    </label>
  </div>
  {#if currentDay === $lastDaily}
    <Button
      onClick={handleCopyToClipboard}
    >
      {copyScoreMessage}  
    </Button>
  {/if}
  {:else}
    <Game seeded={$isDaily} currentDay={currentDay} />
  {/if}
</section>