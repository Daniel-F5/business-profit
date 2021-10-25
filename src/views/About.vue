<template>
  <q-page class="full-height column justify-center items-center">
    <section name="introduce">
    <div class="row justify-between items-center q-mb-lg">
      <div class="col column text-right">
        <q-item-label class="text-h4 text-bold">?Business-profit מה זה בעצם</q-item-label>
        <br>
        <p class="text-subtitle1">היא פלטפורמה לניהול הוצאות והכנסות העסק Business-profit
          <br>
          בעבר עסקים היו מנהלים את ההוצאות שלהם ע"י שירותי הנהלת חשבונות
          <br>
          החסרון הוא שלא ניתן לעקוב אחרי מה שנרשם בפועל בספרים ולא מעט פעמים הוצאות נאבדו או הכנסות לא נרשמו
          <br>
          <b>!Business-profit בדיוק בשביל זה יש את</b>
          </p>
      </div>

      <div class="q-pt-xl q-pl-xl">
      <div class="typewriter">
        <div class="slide"><i></i></div>
        <div class="paper"></div>
        <div class="keyboard"></div>
      </div>
      </div>

    </div>
    </section>

<section name="features">
  <div class="row q-pt-md q-pb-md justify-evenly introduce-div">
    <q-item-label class="text-h4 text-bold fit text-center text-white q-ml-md" color="white">
         ?Business-profit למה כדאי לעבוד עם</q-item-label>
  <q-card class="shadow-24 introduce-div" align="around">
  <div class="row inline q-ma-xs justify-evenly">
    <q-card-section class="col-lg-3 col-md-4 col-sm-12 ">
    <div class="text-center bg-primary feature">
    <q-avatar class="q-my-md" color="secondary" text-color="white" size="6rem" icon="backup"/>
    <q-separator inset />
    <q-item-label class="text-h5 text-white q-pb-md q-pt-lg">גיבוי המסמכים שלך</q-item-label>
    <q-item-label class="text-subtitle1 q-pb-xl q-mx-lg">
      שום דבר מסמך לא ילך יותר לאיבוד! סרוקים את המסמכים והכל מגובה בענן 
    </q-item-label>
    </div>
    </q-card-section>

    <q-card-section class="col-lg-3 col-md-4 col-sm-12">
    <div class="text-center bg-primary feature">
    <q-avatar class="q-my-md" color="secondary" text-color="white" size="6rem" icon="plagiarism"/>
    <q-separator inset />
    <q-item-label class="text-h5 text-white q-py-lg">קל למצוא העתקי חשבוניות</q-item-label>
    <q-item-label class="text-subtitle1 q-pb-lg q-mx-md">
      ניתן לסרוק חשבוניות ובכל פעם שתרצה העתק מסמך לא תצטרך לחפש בערימת ניירת
    </q-item-label>
    </div>
    </q-card-section>
    
    <q-card-section class="col-lg-3 col-md-4 col-sm-12">
    <div class="text-center bg-primary feature">
    <q-avatar class="q-my-md" color="secondary" text-color="white" size="6rem" icon="share"/>
    <q-separator inset />
    <q-item-label class="text-h5 text-white q-py-md q-px-sm">שיתוף פקודות היומן עם רואה החשבון שלך</q-item-label>
    <q-item-label class="text-subtitle1 q-pb-lg q-mx-md">
      תוכל לערוך לעצמך את הנהלת החשבונות ולשלוח גיבוי לרואה החשבון שלך
    </q-item-label>
    </div>
    </q-card-section>
  </div>
  </q-card>
  </div>
</section>
  </q-page>
</template>
<script>

</script>

<style lang="scss">
.introduce-div{
    background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)
}

.feature{
  opacity: 0.8;
}
.feature:hover {
  opacity: 1;
}

.introduce-card{
  border-style: solid;
  border-radius: 5%;
  border-color: white;
}

@mixin keyboard($position: 0, $value: 0) {
    $keys: map-merge((0: '0', 1: '0', 2: '0', 3: '0', 4: '0', 5: '0', 6: '10px', 7: '10px', 8: '10px', 9: '10px'), ($position: $value));
    box-shadow: 15px #{map-get($keys, 0)} 0 var(--key), 30px #{map-get($keys, 1)} 0 var(--key), 45px #{map-get($keys, 2)} 0 var(--key), 60px #{map-get($keys, 3)} 0 var(--key), 75px #{map-get($keys, 4)} 0 var(--key), 90px #{map-get($keys, 5)} 0 var(--key), 22px #{map-get($keys, 6)} 0 var(--key), 37px #{map-get($keys, 7)} 0 var(--key), 52px #{map-get($keys, 8)} 0 var(--key), 60px #{map-get($keys, 8)} 0 var(--key), 68px #{map-get($keys, 8)} 0 var(--key), 83px #{map-get($keys, 9)} 0 var(--key);
}

.typewriter {
    --blue: #5C86FF;
    --blue-dark: #275EFE;
    --key: #fff;
    --paper: #EEF0FD;
    --text: #D3D4EC;
    --tool: #FBC56C;
    --duration: 3s;
    position: relative;
    animation: bounce var(--duration) linear infinite;
    .slide {
        width: 92px;
        height: 20px;
        border-radius: 3px;
        margin-left: 14px;
        transform: translateX(14px);
        background: linear-gradient(var(--blue), var(--blue-dark));
        animation: slide var(--duration) ease infinite;
        &:before,
        &:after,
        i:before {
            content: '';
            position: absolute;
            background: var(--tool);
        }
        &:before {
            width: 2px;
            height: 8px;
            top: 6px;
            left: 100%;
        }
        &:after {
            left: 94px;
            top: 3px;
            height: 14px;
            width: 6px;
            border-radius: 3px;
        }
        i {
            display: block;
            position: absolute;
            right: 100%;
            width: 6px;
            height: 4px;
            top: 4px;
            background: var(--tool);
            &:before {
                right: 100%;
                top: -2px;
                width: 4px;
                border-radius: 2px;
                height: 14px;
            }
        }
    }
    .paper {
        position: absolute;
        left: 24px;
        top: -26px;
        width: 40px;
        height: 46px;
        border-radius: 5px;
        background: var(--paper);
        transform: translateY(46px);
        animation: paper var(--duration) linear infinite;
        &:before {
            content: '';
            position: absolute;
            left: 6px;
            right: 6px;
            top: 7px;
            border-radius: 2px;
            height: 4px;
            transform: scaleY(.8);
            background: var(--text);
            box-shadow: 0 12px 0 var(--text), 0 24px 0 var(--text), 0 36px 0 var(--text);
        }
    }
    .keyboard {
        width: 120px;
        height: 56px;
        margin-top: -10px;
        z-index: 1;
        position: relative;
        &:before,
        &:after {
            content: '';
            position: absolute;
        }
        &:before {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 7px;
            background: linear-gradient(135deg, var(--blue), var(--blue-dark));
            transform: perspective(10px) rotateX(2deg);
            transform-origin: 50% 100%;
        }
        &:after {
            left: 2px;
            top: 25px;
            width: 11px;
            height: 4px;
            border-radius: 2px;
            @include keyboard;
            animation: keyboard var(--duration) linear infinite;
        }
    }
}

@keyframes bounce {
    85%,
    92%,
    100% {
        transform: translateY(0);
    }
    89% {
        transform: translateY(-4px);
    }
    95% {
        transform: translateY(2px);
    }
}

@keyframes slide {
    5% {
        transform: translateX(14px);
    }
    15%,
    30% {
        transform: translateX(6px);
    }
    40%,
    55% {
        transform: translateX(0);
    }
    65%,
    70% {
        transform: translateX(-4px);
    }
    80%,
    89% {
        transform: translateX(-12px);
    }
    100% {
        transform: translateX(14px);
    }
}

@keyframes paper {
    5% {
        transform: translateY(46px);
    }
    20%,
    30% {
        transform: translateY(34px);
    }
    40%,
    55% {
        transform: translateY(22px);
    }
    65%,
    70% {
        transform: translateY(10px);
    }
    80%,
    85% {
        transform: translateY(0);
    }
    92%,
    100% {
        transform: translateY(46px);
    }
}

@keyframes keyboard {
    5%,
    12%,
    21%,
    30%,
    39%,
    48%,
    57%,
    66%,
    75%,
    84% {
        @include keyboard;
    }
    9% {
        @include keyboard(0, 2px);
    }
    18% {
        @include keyboard(3, 2px);
    }
    27% {
        @include keyboard(6, 12px);
    }
    36% {
        @include keyboard(8, 12px);
    }
    45% {
        @include keyboard(5, 2px);
    }
    54% {
        @include keyboard(1, 2px);
    }
    63% {
        @include keyboard(9, 12px);
    }
    72% {
        @include keyboard(2, 2px);
    }
    81% {
        @include keyboard(7, 12px);
    }
}

html {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
}

* {
    box-sizing: inherit;
    &:before,
    &:after {
        box-sizing: inherit;
    }
}

// Center & dribbble
body {
    min-height: 100vh;
    display: flex;
    font-family: 'Roboto', Arial;
    justify-content: center;
    align-items: center;
    background: #fff;
    .dribbble {
        position: fixed;
        display: block;
        right: 20px;
        bottom: 20px;
        img {
            display: block;
            height: 28px;
        }
    }
}

</style>
