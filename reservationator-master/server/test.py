import requests, json, logging

#try:
#    import http.client as http_client
#except ImportError:
    #P2
#    import httplib as http_client
#http_client.HTTPConnection.debuglevel=1
url = "http://localhost:8080/rest"
url2 = "http://localhost:8080/rest?{%22event%22:%22ping%22}"

payload = {
        "event" : "ping"
    }

#logging.basicConfig()
#logging.getLogger().setLevel(logging.DEBUG)
#requests_log = logging.getLogger("requests.packages.urllib3")
#requests_log.setLevel(logging.DEBUG)
#requests_log.propagate = True

#r = requests.get(url, json=payload)
r = requests.get(url, json=payload)
r2 = requests.get(url2);
print(r.text)
print(r2.text)
