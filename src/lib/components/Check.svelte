<script lang="ts">
  import type { Writable } from "svelte/store";

  export let isOnHard: Writable<boolean>;
  
  const handleCheck = (e: Event) => {
    const target = e.target as HTMLInputElement;

    isOnHard.set(target.checked);
    localStorage.setItem('isOnHard', target.checked ? "true" : "false");
  }
</script>

<input type="checkbox" id="hard-mode" tabindex="0" on:change={handleCheck} checked={$isOnHard} />

<style>
  input {
    -webkit-appearance: none;
    appearance: none;
    background-color: var(--accent-bg);
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: .15rem;
    transform: translateY(-0.075rem);
    border: .15rem solid transparent;
    transition: border 300ms;

    &:hover {
      border: .15rem solid var(--accent-border);
    }

    &:checked {
      background-color: var(--accent);
    }

    &:focus-visible {
      outline: .15rem solid var(--accent);
      outline-offset: .125rem;
    }
  }
</style>