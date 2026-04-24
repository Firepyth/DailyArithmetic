<script lang="ts">
  import { getContext, setContext } from "svelte";
  import Game from "./lib/Game.svelte";
  import { writable, type Writable } from "svelte/store";

  const currentDay = Math.floor(Date.now() / (1000 * 60 * 60 * 24) - new Date().getTimezoneOffset() / 60 / 24);
  let copyScoreMessage = "Copy Daily Score";

  setContext('hasStarted', writable(false));
  let hasStarted: Writable<boolean> = getContext('hasStarted');
  
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

<section id="center">
  <div>
    <h1>Daily Arithmetic</h1>
    <p>Perform basic math operations as quickly as you can!</p>
    <p>Every problem you solve gives you a little more time, but with diminishing returns.</p>
  </div>
  {#if $hasStarted === false}
  <h2 class="flex gap-4">
    {#if currentDay === $lastDaily}
      <code>
        Daily Score: {$dailyScore}
      </code>
    {/if}
    <code>
      Most Recent Score: {$score}
    </code>
  </h2>
  <div class="flex gap-4">
    <button class="counter" tabindex="0" on:click={() => handleStart()}>
      Random
    </button>
    <button class="counter" disabled={currentDay === $lastDaily} tabindex="0" on:click={() => handleStart(true)}>
      Daily
    </button>
  </div>
  {#if currentDay === $lastDaily}
    <button class="counter" on:click={handleCopyToClipboard}>
      {copyScoreMessage}
    </button>
  {/if}
  {:else}
    <Game seeded={$isDaily} currentDay={currentDay} />
  {/if}
</section>