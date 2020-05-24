# voidform-optimizer

## redux-v2

### Application Store

```   
store : {
    panel: <string>,
    haste: <number>,
    hasteSources: {
        voidform: <number>,
        lingeringInsanity: <number>
    },
    auras: {
        voidform: {
            active: <boolean>,
            stacks: <number>
        },
        lingeringInsanity: {
            active: <boolean>,
            stacks: <number>
        }
    },
    activeAbilities: [ability: {
        key: <string>,
        displayName: <string>,
        icon: <string>,
        keybind: <string>
    }],
    settings: {
        abilitySettings: {
            void-bolt: {
                cooldown: <number>,
                rankTwo: <boolean>,
                charges: <number>,
                hasted: <boolean>,
                resource: <number>
            },
            void-eruption: {
                threshold: <number>,
                castTime: <number>
            }
            mind-flay: {
                duration: <number>,
                ticks: <number>,
                resource: <number>
            },
            mind-blast: {
                cooldown: <number>,
                charges: <number>,
                castTime: <number>,
                hasted: <boolean>,
                resource: <number>
            },
            shadow-word-death: {
                cooldown: <number>,
                charges: <number>,
                hasted: <boolean>,
                hasted: <boolean>,
                resource: <number>
            }
        },
        auraSettings: {
            voidform: {
                drainStart: <number>,
                drainRate: <number>,
                hasteStart: <number>,
                hasteStack: <number>,
                maxStacks: <number>
            },
            lingeringInsanity: {
                type: ["static","decay"],
                static: {
                    duration: <number>,
                    afterVoidformEntry: <boolean>,
                    hasteRetention: <number>
                },
                decay: {
                    rate: <number>,
                    haste: <number>
                }
            }
        }
    }
}
```

### Application Context

 * `CurrentAbilityContext`
 * `AuraContext`
 * `AbilitySettingsContext`

