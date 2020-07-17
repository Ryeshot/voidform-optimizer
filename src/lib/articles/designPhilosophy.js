export default [{
    header: "",
    content: "This will be a detailed article on my design philosophy regarding the baseline health of Shadow and Voidform. \
    If you want to skip the reasoning behind my design decisions, you can try the design out yourself using the \"Ryeshot's \
    Shadowlands\" template on the main page. I will be breaking this article down by the changes made to each element of the \
    spec, and the reasons for those changes."
},
{
    header: "Voidform",
    content: "The core of Voidform in my mind boils down to two things. It is a self-perpetuating state that mimics the descent \
    into madness. It also enables Void Bolt. Therefore I made Voidform do these two things and only these two things. Get rid of \
    borrowed power (good riddance Mass Hysteria and Chorus of Insanity), get rid of Lingering Insanity (more reason will be \
    provided later), get rid of Mind Blast cooldown reduction (why did this exist?). \
    \n\n\
    Voidform now immediately grants 10% haste and grants an extra 1% haste per stack while in Voidform. Entering Voidform \
    should immediately be noticeable due to the rotation quickening immediately. Additionally, unlike existing Voidform at \
    .5% haste per stack, you should be able to feel the quickening pace of your rotation while you remain in Voidform. You \
    should now feel like you are going insane while in Voidform!"   
},
{
    header: "Shadowform",
    content: "Because of how Voidform is designed, Shadowform by necessity must be slow-paced. If you want to think about \
    Voidform as the high, then Shadowform is the low. There needs to be some time between Voidforms so that it is not \
    thought of as the default state, otherwise the player will become desensitized to its effects. This time should be \
    just long enough to begin wanting Voidform again, but not long enough to experience fatigue from the lack of Voidform."
},
{
    header: "Mind Blast",
    content: "Mind blast has two charges baseline. I think the reason is pretty self apparent, but for those who aren't \
    aware: Void Bolt and Mind Blast cause an effect call clashing, which means they come off cooldown at the same time. \
    This causes the lower priority spell (in this case Mind Blast) to be off cooldown during the global of the higher priority \
    spell (Void Bolt). Adding a second charge to Mind Blast removes this issue, since Mind Blast will continue \
    recharging when its cooldown clashes with Void Bolt.\
    \n\n\
    Mind Blast now generates 25 Insanity. This makes Shadowform's length shorter and makes less of a dependency of casting \
    Mind Flay to generate Insanity. You can now generate more Insanity while moving because your Insanity budget now \
    resides mostly in Void Bolt and Mind Blast (due to it recharging while moving).\
    \n\n\
    Mind blast no longer has its cooldown reduced while in Voidform. There was no reason for this to exist so I removed it."
},
{
    header: "Void Bolt",
    content: "Now generates 15 Insanity. Because I want Mind Blast to be the Insanity nuke of the spec, I needed to reduce \
    Void Bolt's Insanity generation so generation between the two spells did not feel too similar." 
},
{
    header: "Devouring Plague",
    content: "Blizzard added Devouring Plague with the express purpose of having an option for spending Insanity in content \
    that does not support Voidform. I expanded upon this purpose and designed an ability which I believe to be a compelling \
    skill to press no matter the content.\
    \n\n\
    Devouring Plague spends all Insanity and generates 30 Insanity over its duration. Due to spending all Insanity, Devouring \
    Plague can now be used as an option to exit Voidform at will. It can also be used as (one of) the last spell in your \
    Voidform; scraping for any remaining Insanity and hurling it at your foe. Lastly, it can be used out of Voidform to \
    deal damage to an enemy that either will not last for Voidform's duration, or should you wish to do more priority damage \
    to that target.\
    \n\n\
    The fact that Devouring Plague also generates Insanity over its duration means that after using it you can get a faster \
    cast of another Devouring Plague or Void Eruption."
},
{
    header: "Lingering Insanity",
    content: "Lingering Insanity has been removed. No talent, not baseline; gone, poof. In a world where Voidform has base \
    haste, I could not think of a valid reason to keep Lingering Insanity. The purpose for Lingering Insanity is to smooth \
    the transitions between Voidforms. Not only is that counter to the design of Shadowform as explained above, it is no \
    longer necessary due to the duration in Shadowform being tolerable and entering Voidform having an immediate impact \
    on the pacing of the gameplay."
},
{
    header: "Starting Insanity",
    content: "Now gain 30 Insanity while out of combat. This alleviates the pain point for having the first Voidform of \
    a fight take longer than every other one. It also provides quick options for using Insanity in content where casting \
    Void Eruption is not the only option."
},
{
    header: "Insanity Drain",
    content: "Insanity drain was adjusted such that you can reach a soft cap of 25 stacks at entry-raid levels of haste. \
    If you wish to know the exact numbers, Voidform starts at a drain of 6 Insanity per second, which increases at a rate of \
    .66 Insanity per stack."
}
]