---
title: "Home"
---

# REACH Project South&nbsp;Africa

Exciting, African-language storybooks available now!
{:.subheadline}

Storybooks created in African languages can be hard to come by in
South Africa – the REACH project supports local publishers to begin to
change this.

[Room to Read](http://roomtoread.org) has partnered with [Electric Book Works](https://electricbookworks.com) and [African Storybook](http://africanstorybook.org) to publish **20 African-language storybooks** created by South Africans. All stories target early grade learners in grades R–3. Each book was originally written in **Sepedi, siSwati, Xitsonga, Tshivenda or isiZulu,** and is available in all of these languages, as well as English. Anyone can freely download the files, and share and distribute these books.

This project is funded by Results in Education for All Children (REACH) trust fund at the World Bank and the Global Book Alliance, and supported by the Department of Basic Education. 

## Books

{% for book in site.books %}

{% comment %} List the books in their English form. {% endcomment %}
{% capture book-locale %}{{ book.url | split: "/" | last }}{% endcapture %}
{% if book-locale == "en" %}
{% include book-listing.html %}
{% endif %}

{% endfor %}
