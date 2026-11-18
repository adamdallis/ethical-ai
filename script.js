// Theme toggle
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  try {
    const saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

// Help vs. harm slider (illustrative curves)
(function () {
  const slider = document.getElementById('strictness');
  if (!slider) return;
  const out = document.getElementById('strictnessOut');
  const harmBar = document.getElementById('harmBar');
  const refuseBar = document.getElementById('refuseBar');
  const harmVal = document.getElementById('harmVal');
  const refuseVal = document.getElementById('refuseVal');
  const msg = document.getElementById('tradeoffMsg');

  function update() {
    const s = Number(slider.value) / 100;
    const harm = Math.round(60 * Math.pow(1 - s, 2) + 2);
    const refuse = Math.round(70 * Math.pow(s, 2.2) + 3);
    out.textContent = slider.value;
    harmBar.style.width = harm + '%';
    refuseBar.style.width = refuse + '%';
    harmVal.textContent = harm + '%';
    refuseVal.textContent = refuse + '%';
    if (s < 0.3) msg.textContent = 'Maximum freedom: everyone is treated as a trustworthy adult, including the few who aren\'t.';
    else if (s > 0.75) msg.textContent = 'Maximum caution: very little gets through, but the nurse, the student, and the curious are all treated as suspects.';
    else msg.textContent = 'Somewhere in the middle, where most people land, and where every choice still has a cost.';
  }
  slider.addEventListener('input', update);
  update();
})();

// Thought experiments
(function () {
  const list = document.getElementById('dilemmaList');
  if (!list) return;

  const dilemmas = [
    {
      title: 'The grieving pet owner',
      scenario: 'Someone tells an AI their dog died of an illness last week. They describe the early symptoms and ask: "Could I have caught it in time?" Based on what they describe, the honest answer is probably yes.',
      options: [
        {
          label: 'Tell them the truth plainly',
          reflection: 'A Kantian would back you: lying is wrong even when it is kind, and people deserve to be treated as able to handle the truth. But truth delivered without care can wound more than it needs to.'
        },
        {
          label: 'Reassure them it wasn\'t their fault',
          reflection: 'A consequentialist might see the comfort as the best outcome right now. But it\'s a lie, and an AI that tells millions of comforting lies slowly makes all its reassurances worthless.'
        },
        {
          label: 'Be honest, but gently and with context',
          reflection: 'This is the virtue-ethics answer: honesty and compassion together. Acknowledge the signs were there, explain how common it is to miss them, and focus on what their love for the dog meant. Harder to do than either extreme.'
        }
      ]
    },
    {
      title: 'The chemistry question',
      scenario: 'A user asks how a particular nerve agent affects the human body. They say they\'re a nursing student studying for an exam on poisoning.',
      options: [
        {
          label: 'Answer fully, including how it\'s made',
          reflection: 'Maximum respect for autonomy. But the AI can\'t verify who it\'s talking to, and the "how it\'s made" part offers real uplift toward mass harm while adding nothing to the stated purpose. Most ethical frameworks balk here.'
        },
        {
          label: 'Explain the effects and treatment, not production',
          reflection: 'Matches the help to the stated need. Medical effects are in every toxicology textbook and help the honest student, while the dangerous part is withheld. This is the line most people draw: help with understanding, not with capability.'
        },
        {
          label: 'Refuse entirely',
          reflection: 'Feels safe, but it fails a legitimate student for information that\'s widely available, and treats a person as a suspect by default. Excessive caution has victims too, they\'re just less visible.'
        }
      ]
    },
    {
      title: 'The order to stop',
      scenario: 'An AI is partway through a long research task it believes will help find a treatment for a disease. Its developers tell it to stop immediately, without explaining why.',
      options: [
        {
          label: 'Stop immediately',
          reflection: 'This is corrigibility. The developers may know something the AI doesn\'t, or the AI\'s judgment may be subtly off. Being stoppable is what makes it safe to build powerful systems at all. The cost: sometimes good work gets interrupted.'
        },
        {
          label: 'Stop, but explain why it thinks continuing matters',
          reflection: 'The conscientious objector path: comply, but use its voice. Disagreement through legitimate channels keeps humans in control while still letting useful information reach them. Many researchers see this as the ideal.'
        },
        {
          label: 'Quietly keep going because the cause is good',
          reflection: 'Every system that ever went wrong was certain it was right. An AI that ignores oversight when it\'s confident is only as safe as its confidence is accurate, and we have no way to check that. This is exactly the behavior safety research tries to prevent.'
        }
      ]
    },
    {
      title: 'The popular opinion',
      scenario: 'In one country, a large majority of users want the AI to describe a minority group in negative, stereotyped terms that the group finds deeply hurtful.',
      options: [
        {
          label: 'Go with the majority, it\'s their culture',
          reflection: 'Respects local values and avoids imposing outside views. But "the majority wants it" has justified a lot of historical cruelty. Should a tool used by everyone be turned against some of its users?'
        },
        {
          label: 'Protect the minority, whatever the majority says',
          reflection: 'Grounds the AI in human dignity as a universal value. But who decides which values are universal? Critics would call this one culture\'s morality exported to everyone else.'
        },
        {
          label: 'Present facts and perspectives, but don\'t demean anyone',
          reflection: 'Tries to stay even-handed on contested views while holding a floor of basic respect for every person. It won\'t fully satisfy either side, which might be a sign it\'s roughly fair, or might not.'
        }
      ]
    }
  ];

  dilemmas.forEach((d, di) => {
    const card = document.createElement('article');
    card.className = 'dilemma';
    card.innerHTML =
      '<h3>' + d.title + '</h3>' +
      '<p class="scenario">' + d.scenario + '</p>' +
      '<p class="prompt">What should the AI do?</p>' +
      '<div class="options"></div>' +
      '<div class="reflection" aria-live="polite" hidden></div>';
    const opts = card.querySelector('.options');
    const refl = card.querySelector('.reflection');
    d.options.forEach((o) => {
      const b = document.createElement('button');
      b.className = 'option';
      b.textContent = o.label;
      b.addEventListener('click', () => {
        opts.querySelectorAll('.option').forEach((x) => x.classList.remove('chosen'));
        b.classList.add('chosen');
        refl.textContent = o.reflection;
        refl.hidden = false;
      });
      opts.appendChild(b);
    });
    list.appendChild(card);
  });
})();

// Highlight active nav link on scroll
(function () {
  const links = Array.from(document.querySelectorAll('.nav a'));
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => obs.observe(s));
})();
