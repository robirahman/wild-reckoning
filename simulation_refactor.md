Looking at the code, it seems like most features of the world are being specifically hardcoded. The abstractions need to be constructed with some forethought.



The ideal is a simulation that reproduces the emergent complications that dominate the rhythms of our everyday lives: Murphy’s law and feedback loops and trivial inconveniences and so on.  In general, you get this by providing the abstract dynamics of the world, and then letting the object-level details work themselves out according to these dynamics.



For instance: you postulate a set of facts, like that the “ulna” is a “bone” in the “legs”; that “bones” can “fracture” upon intense “stress”, that falls and local impacts are the kinds of things that have varying intensities and cause stresses to legs, etc... -- and then, if you want to include the possibility of fights with other deer, you just need to postulate what these fights involve, and then it will \*follow\* from the application of the coded dynamics to all of these facts that a fight can break a bone if you get hit hard, can be harder and more damaging if you have broken bones, and so on.



The alternative to this is enumerating a bunch of specific events like “fight with existing broken bone aggravates same broken bone”, “fight breaks randomly chosen leg bone”, and a trillion other things.  Which Claude Code will absolutely try to do, but it’ll only write a couple of these specific cases.



(And it’s a legitimate choice, to just have a bunch of hardcoded sets of outcomes, but then the game should be conceptualized and intended as something more like a \*visual novel\* exploring the life of a wild animal rather than a \*simulation\*.  Maybe you want to make that call to massively simplify things, but the original vision was to create a full simulation).



Anyway, some points on style/narrative I've been thinking about:



\- The outcome distribution should be at least moderately calibrated, for the sake of realism — your likelihood of dying for a given reason should be of the same order of magnitude as the real likelihood.

    This calibration is nontrivial, since the actual behavior of deer \[or whatever animal] is controlled by instincts that evolved for things like avoiding wolves.  If you let a human 'pilot' an actual deer, that deer probably would end up being eaten (or poisoning itself) very quickly, because it wouldn’t behave according to those instincts!  So how do you square player freedom with predictable outcomes?  Probably nudging is the most reliable way to do so: things like hinting that the animal is anxious when in an open area.  (e.g., as a little status modifier that appears upon hover: “The sense of open space behind you is unnerving. You’d feel okay in a more sheltered area.”).  An LLM like Gemini 3 Flash would need to playtest the game to verify that reasonable decisions lead to calibrated outcomes.



\- To keep the game entertaining despite this, I think you generally want to \*skip\* early childhood, since for altricial animals (including most mammals) this involves few meaningful choices: you suckle when you can, cry when you can’t, sleep when you need to, wait for mom to come back, keep waiting, keep waiting, keep waiting, you die.  Narratively, this skip could start off as a release from a wildlife rehabilitation center.  Then, it's only your children that keep getting spawnkilled, not you.



\- This isn’t that important, and might just annoy the player, but ideally you would unlock the ability to play as the lion once you 'win' as the sheep (e.g. have children that survive into adulthood).  Hunting sheep as a lion should make you remember what it’s like to be hunted as a sheep.  And to this end every NPC animal should be narratively described in a way that suggests that they’re at the center of their own entire game-world, even though they’re not.  Like, the behavior of the sheep being hunted should be described in ways that mirror the choices that you can make when you're a sheep running away from a lion.



\- Importantly, the descriptions of things should be unusually literal where possible -- they should be described as the animal conceptualizes them.  The player is told that large pink ropes are attached to the place where a towering monster struck them, and they may \*privately\* infer that they've been \*disemboweled\* by a \*bear\*, but the narration itself shouldn't make this information any clearer than it natively is to the animal.  Probably this looks like a sort of Lynchian absurdism; the animal doesn’t know or understand why these ropes are suddenly weighing them down, it just wants them gone, so chewing through them makes sense from the animal's point of view, and from the player's as well, if they don't make that private inference.  (Maybe there ought to be a 'debriefing' at the end that re-runs through the events of the animal's life in the way we would conceptualize them).



But there need to be many exceptions to the direct description rule, otherwise it just ends up making the world seem like a parade of inexplicable events -- which, well, is probably just how it is for animals, but which is deeply unsatisfying and unplayable.



Two general heuristics are that the narration should disclose what's really going on, e.g. via standard medical names, when...



1\. Such names provide the same information that somatic experience and instinct would.  Like, we should say 'broken ulna' and so on, because the deer obviously feels \*where\* a prolonged injury is, and 'ulna' is a description of that feeling; and the deer feels this injury in a way that makes it want to limp and avoid running (as we do when a bone is 'broken').



2\. Such information isn't directly actionable.  Knowing that a foul-smelling sore on your flank is a 'bacterial infection' doesn't allow you to do anything you wouldn't otherwise do; knowing that the lancing pain through your body is a 'brainworm' doesn't help you fix it.  Maybe the player can infer "be careful around berries in the future" in a way that an actual deer wouldn't, but this effect should be both minor and partially replicated by actual deer \*instincts\*, so the clarity and impact of disclosing the information outweighs any slight miscalibration imo.



The general rule seems like "avoid providing details that the player can use to metagame" -- as w/ knowing that you shouldn't chew through your own intestines.

