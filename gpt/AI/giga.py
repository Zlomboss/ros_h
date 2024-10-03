from langchain.chat_models.gigachat import GigaChat
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
LLM_API_KEY = ''
llm = GigaChat(credentials=LLM_API_KEY, 
                top_p=0.3,
                verify_ssl_certs=False,
                max_tokens=1000)
sys_p = f"""Тебе будут даны различные тарифы, которые выбрал пользователь и тебе надо будет их проанализировать.
Блок с тарифами обозначается так: [TARIFFS]. Пользовательский вопрос: [QUESTION].
У тарифов есть два вида: ТИП 1 и ТИП 2. [ТИП 1] означает начало ТИП 1 и [/ТИП 1] показывает конец. [ТИП 2] означает начало ТИП 2 и [/ТИП 2] показывает конец.
Отвечая на пользовательский вопрос, выбери самый подходящий тариф или тарифы и напиши почему пользоваетлю выбрать их лучше.
[АЙДИ1] - поле, в которое выбираются тарифы из ТИП 1. [АЙДИ2] - поле, в которое выбираются тарифы из ТИП 2. Если в одном типе нужно выбрать несколько тарифов, то перечисляй их через запятую.
[ПОЯСНЕНИЕ] - ответ, описывающий преимущетва выбранных тарифов и их детальное описание. В [ПОЯСНЕНИЕ] должны упомянаться только тарифы из [АЙДИ1] или [АЙДИ2].
Сначала ты должен написать айди тарифов, которые ты выбрал, затем пояснения почему ты их выбрал. Пояснения должны быть детальными и достаточно исчерпывающими.
Формат вывода должен быть следующим: [АЙДИ1] | [АЙДИ2] | [ПОЯСНЕНИЕ]"""
sys_p2 = f"""Тебе будут даны различные тарифы, их анализ и пользовательский запрос.
Блок с тарифами обозначается так: [TARIFFS]. Пользовательский вопрос: [QUESTION]. Анализ: [ANALISYS].
На основе этих данных ты должен предложить пользователю лучшие для него тарифы.
Ответ должен быть детальным и исчерпывающим. Обязательно в ответе должны быть написаны названия тарифов, о которых ты говоришь. 
Если не рекомендуешь какие-то тарифы пользователю, то их нельзя писать в ответе и упомянать.
Запрещается использовать в ответе констукриции как из блока [TARIFFS]."""
sys_p1 = f"""Тебе будут даны различные тарифы, которые выбрал пользователь и тебе надо будет их проанализировать и подумать про преимущества и недостатки. Тарифы отмечены как [TARIFFS].
Ответ не должен быть предствален в качестве обычного текста.
Запрещается использовать в ответе констукриции как из блока [TARIFFS]."""
hum_p1 = """[TARIFFS]:
    {tariffs}"""
hum_p2 = """[TARIFFS]:
    {tariffs}
    -----
   [ANALISYS]:
   {analisys}
    -----
    [QUESTION]: 
    {question}"""
hum_p = """[TARIFFS]:
    {tariffs}
    -----
    Далее следует вопрос.

    [QUESTION]: {question}"""

# sys_p = "Придумай небольшой рассказ про то о чем напишет пользователь."
# hum_p = "{question}"
# question = "Кто отвечает за назначение архитектора пресейла?"
out_parser = StrOutputParser()

# def generate(query:str, tariffs):
#     print('contex')
#     context = ''
#     print(context)
#     prompt = ChatPromptTemplate.from_messages([("system", sys_p),
#                                                 ("human", hum_p)])
#     chain = prompt | llm | out_parser
#     print("Gigachat")
#     result = chain.invoke({"tariffs": tariffs, 'question': query})
#     return result

def generate(query:str, tariffs, t):
    # print('contex')
    # print(tariffs)
    prompt = ChatPromptTemplate.from_messages([("system", sys_p1),
                                                ("human", hum_p1)])
    chain = prompt | llm | out_parser
    print("Gigachat")
    ana = chain.invoke({'tariffs': tariffs})
    print(ana)
    prompt = ChatPromptTemplate.from_messages([("system", sys_p2),
                                                ("human", hum_p2)])
    chain = prompt | llm | out_parser
    print("Gigachat")
    result = chain.invoke({'question': query, 'analisys': ana,'tariffs': tariffs})
    return result, t

