#-*- coding=utf-8 -*-
import requests
import sys
import re
from threading import Thread
from Queue import Queue


def get_content(url):
    try:
        r = requests.get(url, timeout=5)
        return r.content
    except:
        return False


def get_flag(content, word):
    exists = re.findall(word, content)
    if len(exists) > 0:
        return True
    else:
        return False


def get_all_url(url):
    content = get_content(url)
    if content <> False:
        urls = re.findall('''<a.*? href=["'\s](https{0,1}://.*?)["'/\s]''', content)
        return list(set(urls))
    else:
        return False


def geturls(url):
    if not (url.startswith('http://') or url.startswith('https://')):
        click.echo('url must start with http:// or https://')
        sys.exit()
    urls = get_all_url(url)
    if not urls:
        data = {'code': 0, 'urls': [
            {'url': url, 'status': 'timeout', 'exists': 'timeout'}]}
        return data
        sys.exit()
    data = {'code': 0}
    for url in urls:
        data.setdefault('urls', []).append(
            {'url': url, 'status': '...', 'exists': '...'})
    return data


def checkone(url, word):
    data = {"code": 0}
    content = get_content(url)
    if not content:
        data['status'] = 'timeout'
        data['exists'] = 'timeout'
    else:
        if get_flag(content, word):
            data['status'] = 'normal'
            data['exists'] = 'Yes'
        else:
            data['status'] = 'normal'
            data['exists'] = 'No'
    return data


def checkurl(url, word):
    """
    the tool is use for check the status of your website's friend url.\n
    url: your website url. like: http://www.video4sex.com\n
    word: the identifier of prove your website dose exists in other website.
    """
    if not (url.startswith('http://') or url.startswith('https://')):
        click.echo('url must start with http:// or https://')
        sys.exit()
    urls = get_all_url(url)
    if not urls:
        data = {'code': 0, urls: [
            {'url': url, 'status': 'timeout', 'exists': 'timeout'}]}
        sys.exit()
    data = {'code': 0}
    wait_queue = Queue()
    cpl_queue = Queue()
    click.echo('{no} urls waiting for checkout!!'.format(no=len(urls)))
    i = 0
    for c_url in urls[:20]:
        wait_queue.put((c_url, word, data, len(urls)))
    tasks = [Check(wait_queue, cpl_queue) for i in range(8)]
    for task in tasks:
        task.start()
    for task in tasks:
        task.join()
    return data
